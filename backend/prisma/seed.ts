import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create TAs
  const ta1 = await prisma.ta.create({
    data: {
      name: 'Alice Johnson',
      degree: 'Bachelor of Science in Computer Science',
      gpa: 3.8,
      bio: 'Expert in algorithms and data structures',
    },
  });

  const ta2 = await prisma.ta.create({
    data: {
      name: 'Bob Smith',
      degree: 'Bachelor of Science in Computer Science',
      gpa: 3.6,
      bio: 'Specialist in web development and databases',
    },
  });

  const ta3 = await prisma.ta.create({
    data: {
      name: 'Carol Davis',
      degree: 'Master of Science in Computer Science',
      gpa: 3.9,
      bio: 'Advanced algorithms and competitive programming mentor',
    },
  });

  console.log('Created TAs:', { ta1, ta2, ta3 });

  // Create Courses (without TA relationships first)
  const course1 = await prisma.course.create({
    data: {
      code: 'COMP 248',
      name: 'Object-Oriented Programming',
      description:
        'Introduction to object-oriented programming using Java and C++',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      code: 'ECSE 202',
      name: 'Data Structures and Algorithms',
      description: 'Comprehensive study of data structures and algorithm design',
    },
  });

  const course3 = await prisma.course.create({
    data: {
      code: 'COMP 353',
      name: 'Databases',
      description: 'Relational databases, SQL, and database design',
    },
  });

  // Create CourseTA relationships
  await prisma.courseTA.create({
    data: { courseId: course1.id, taId: ta1.id },
  });
  await prisma.courseTA.create({
    data: { courseId: course1.id, taId: ta2.id },
  });
  await prisma.courseTA.create({
    data: { courseId: course2.id, taId: ta1.id },
  });
  await prisma.courseTA.create({
    data: { courseId: course2.id, taId: ta3.id },
  });
  await prisma.courseTA.create({
    data: { courseId: course3.id, taId: ta2.id },
  });

  console.log('Created Courses:', { course1, course2, course3 });

  // Create Products
  const individualSession1 = await prisma.product.create({
    data: {
      courseId: course1.id,
      name: 'Individual 1:1 Session',
      productType: 'INDIVIDUAL_SESSION',
      description: 'One-on-one tutoring session for COMP 248',
      basePrice: 40.0,
      isActive: true,
    },
  });

  const bundleFullSem1 = await prisma.product.create({
    data: {
      courseId: course1.id,
      name: 'Full Semester Bundle',
      productType: 'FULL_SEMESTER_BUNDLE',
      description: 'Weekly help, labs, midterm, final prep - 12 sessions',
      basePrice: 400.0,
      isActive: true,
    },
  });

  const bundleMidFinal1 = await prisma.product.create({
    data: {
      courseId: course1.id,
      name: 'Midterm + Final Bundle',
      productType: 'MIDTERM_FINAL_BUNDLE',
      description: 'Midterm and final exam prep - 6 sessions',
      basePrice: 200.0,
      isActive: true,
    },
  });

  const individualSession2 = await prisma.product.create({
    data: {
      courseId: course2.id,
      name: 'Individual 1:1 Session',
      productType: 'INDIVIDUAL_SESSION',
      description: 'One-on-one tutoring session for ECSE 202',
      basePrice: 45.0,
      isActive: true,
    },
  });

  const bundleFullSem2 = await prisma.product.create({
    data: {
      courseId: course2.id,
      name: 'Full Semester Bundle',
      productType: 'FULL_SEMESTER_BUNDLE',
      description: 'Weekly help, labs, midterm, final prep - 12 sessions',
      basePrice: 450.0,
      isActive: true,
    },
  });

  console.log('Created Products');

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      email: 'student1@example.com',
      name: 'John Doe',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      email: 'student2@example.com',
      name: 'Jane Smith',
    },
  });

  const student3 = await prisma.student.create({
    data: {
      email: 'student3@example.com',
      name: 'Mike Johnson',
    },
  });

  console.log('Created Students:', { student1, student2, student3 });

  // Create Group Session Templates
  const groupSession1 = await prisma.groupSessionTemplate.create({
    data: {
      courseId: course1.id,
      taId: ta1.id,
      dayOfWeek: 1, // Monday
      startTime: '18:00',
      endTime: '19:30',
      capacity: 5,
      pricePerStudent: 15.0,
      isActive: true,
    },
  });

  const groupSession2 = await prisma.groupSessionTemplate.create({
    data: {
      courseId: course1.id,
      taId: ta2.id,
      dayOfWeek: 3, // Wednesday
      startTime: '19:00',
      endTime: '20:30',
      capacity: 6,
      pricePerStudent: 15.0,
      isActive: true,
    },
  });

  const groupSession3 = await prisma.groupSessionTemplate.create({
    data: {
      courseId: course2.id,
      taId: ta1.id,
      dayOfWeek: 2, // Tuesday
      startTime: '17:00',
      endTime: '18:30',
      capacity: 4,
      pricePerStudent: 18.0,
      isActive: true,
    },
  });

  console.log('Created Group Session Templates');

  // Create Bundle Purchases
  const bundlePurchase1 = await prisma.bundlePurchase.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      productId: bundleFullSem1.id,
      coverageType: 'FULL_SEMESTER',
      totalSessions: 12,
      remainingSessions: 12,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-05-31'),
    },
  });

  const bundlePurchase2 = await prisma.bundlePurchase.create({
    data: {
      studentId: student2.id,
      courseId: course2.id,
      productId: bundleFullSem2.id,
      coverageType: 'FULL_SEMESTER',
      totalSessions: 12,
      remainingSessions: 10,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-05-31'),
    },
  });

  console.log('Created Bundle Purchases');

  // Create a Group Booking
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
  nextMonday.setHours(18, 0, 0, 0);

  const groupBooking = await prisma.booking.create({
    data: {
      courseId: course1.id,
      taId: ta1.id,
      status: 'AVAILABLE',
      sessionType: 'GROUP',
      date: nextMonday,
      durationMinutes: 90,
      pricePerStudent: 15.0,
      groupSessionTemplateId: groupSession1.id,
    },
  });

  // Add students to group booking
  await prisma.bookingStudent.create({
    data: {
      bookingId: groupBooking.id,
      studentId: student1.id,
    },
  });

  await prisma.bookingStudent.create({
    data: {
      bookingId: groupBooking.id,
      studentId: student3.id,
    },
  });

  console.log('Created Group Booking');

  // Create an Individual Booking with Bundle
  const nextThursday = new Date(now);
  nextThursday.setDate(
    nextThursday.getDate() + ((4 + 7 - nextThursday.getDay()) % 7 || 7),
  );
  nextThursday.setHours(15, 0, 0, 0);

  const individualBooking = await prisma.booking.create({
    data: {
      courseId: course1.id,
      taId: ta1.id,
      status: 'BOOKED',
      sessionType: 'INDIVIDUAL',
      date: nextThursday,
      durationMinutes: 60,
      pricePerStudent: 0, // Covered by bundle
      bundlePurchaseId: bundlePurchase1.id,
    },
  });

  // Add student to individual booking
  await prisma.bookingStudent.create({
    data: {
      bookingId: individualBooking.id,
      studentId: student1.id,
    },
  });

  console.log('Created Individual Booking');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
