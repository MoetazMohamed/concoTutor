-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REQUESTED', 'BOOKED', 'AVAILABLE', 'FULL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('INDIVIDUAL_SESSION', 'FULL_SEMESTER_BUNDLE', 'MIDTERM_FINAL_BUNDLE', 'GROUP_SESSION_PASS');

-- CreateEnum
CREATE TYPE "BundleCoverageType" AS ENUM ('FULL_SEMESTER', 'MIDTERM_FINAL_ONLY');

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT,
    "gpa" DOUBLE PRECISION,
    "bio" TEXT,

    CONSTRAINT "tas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tas" (
    "courseId" TEXT NOT NULL,
    "taId" TEXT NOT NULL,

    CONSTRAINT "course_tas_pkey" PRIMARY KEY ("courseId","taId")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_purchases" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "coverageType" "BundleCoverageType" NOT NULL,
    "totalSessions" INTEGER NOT NULL,
    "remainingSessions" INTEGER NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundle_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_session_templates" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "taId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerStudent" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "group_session_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "taId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "pricePerStudent" DECIMAL(10,2) NOT NULL,
    "groupSessionTemplateId" TEXT,
    "bundlePurchaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_students" (
    "bookingId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "booking_students_pkey" PRIMARY KEY ("bookingId","studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_courseId_productType_key" ON "products"("courseId", "productType");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_purchases_studentId_courseId_productId_key" ON "bundle_purchases"("studentId", "courseId", "productId");

-- AddForeignKey
ALTER TABLE "course_tas" ADD CONSTRAINT "course_tas_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tas" ADD CONSTRAINT "course_tas_taId_fkey" FOREIGN KEY ("taId") REFERENCES "tas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_purchases" ADD CONSTRAINT "bundle_purchases_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_purchases" ADD CONSTRAINT "bundle_purchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_purchases" ADD CONSTRAINT "bundle_purchases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_session_templates" ADD CONSTRAINT "group_session_templates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_session_templates" ADD CONSTRAINT "group_session_templates_taId_fkey" FOREIGN KEY ("taId") REFERENCES "tas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_taId_fkey" FOREIGN KEY ("taId") REFERENCES "tas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_groupSessionTemplateId_fkey" FOREIGN KEY ("groupSessionTemplateId") REFERENCES "group_session_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bundlePurchaseId_fkey" FOREIGN KEY ("bundlePurchaseId") REFERENCES "bundle_purchases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_students" ADD CONSTRAINT "booking_students_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_students" ADD CONSTRAINT "booking_students_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
