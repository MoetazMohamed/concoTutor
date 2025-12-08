/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `tas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `tas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `tas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "totalCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usedCredits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tas" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "credit_transactions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ta_availability" (
    "id" TEXT NOT NULL,
    "taId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ta_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ta_availability_taId_courseId_dayOfWeek_startTime_key" ON "ta_availability"("taId", "courseId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "tas_email_key" ON "tas"("email");

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ta_availability" ADD CONSTRAINT "ta_availability_taId_fkey" FOREIGN KEY ("taId") REFERENCES "tas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ta_availability" ADD CONSTRAINT "ta_availability_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
