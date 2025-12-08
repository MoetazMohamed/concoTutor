/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `ta_availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taId,courseId,date,startTime]` on the table `ta_availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `ta_availability` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ta_availability_taId_courseId_dayOfWeek_startTime_key";

-- AlterTable
ALTER TABLE "ta_availability" DROP COLUMN "dayOfWeek",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ta_availability_taId_courseId_date_startTime_key" ON "ta_availability"("taId", "courseId", "date", "startTime");
