import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CourseDto, CreateCourseDto, CreateCourseByTutorDto, CourseSupportOptionsDto } from './courses.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(): Promise<any[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        products: {
          where: { isActive: true },
        },
        tas: {
          include: { ta: true },
        },
        taAvailability: {
          where: { isActive: true },
        },
      },
      orderBy: { code: 'asc' },
    });

    return courses.map(course => ({
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      tas: course.tas.map(ct => ({
        id: ct.ta.id,
        name: ct.ta.name,
        email: ct.ta.email,
        bio: ct.ta.bio,
      })),
      products: course.products,
      availabilityCount: course.taAvailability.length,
    }));
  }

  async getCourseById(id: string): Promise<any> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
        },
        tas: {
          include: { ta: true },
        },
        taAvailability: {
          where: { isActive: true },
          include: { ta: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      tas: course.tas.map(ct => ({
        id: ct.ta.id,
        name: ct.ta.name,
        email: ct.ta.email,
        bio: ct.ta.bio,
        degree: ct.ta.degree,
      })),
      products: course.products,
      availability: course.taAvailability.map(slot => ({
        id: slot.id,
        taId: slot.taId,
        taName: slot.ta.name,
        date: slot.date.toISOString().split('T')[0],
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity: slot.capacity,
        bookedCount: slot.bookedCount,
        availableSeats: slot.capacity - slot.bookedCount,
      })),
    };
  }

  async getCourseSupportOptions(
    courseId: string,
    studentId?: string,
  ): Promise<CourseSupportOptionsDto> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        products: {
          where: { isActive: true },
        },
        tas: {
          include: { ta: true },
        },
        taAvailability: {
          where: { isActive: true },
          include: { ta: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Get products for this course
    const products = course.products;

    // Get TAs for this course
    const tas = course.tas.map(ct => ({
      id: ct.ta.id,
      name: ct.ta.name,
      email: ct.ta.email,
      bio: ct.ta.bio,
      degree: ct.ta.degree,
    }));

    // Get upcoming group sessions (today onwards)
    const now = new Date();
    const upcomingGroupSessions = await this.prisma.groupSessionTemplate.findMany({
      where: { courseId, isActive: true },
      include: { ta: true },
    });

    // Get active bundles for student (if provided)
    let activeStudentBundles: any[] = [];
    if (studentId) {
      activeStudentBundles = await this.prisma.bundlePurchase.findMany({
        where: {
          studentId,
          courseId,
          validFrom: { lte: now },
          validTo: { gte: now },
        },
        include: { product: true },
      });
    }

    // Get available TA slots for this course
    const availableSlots = course.taAvailability.map(slot => ({
      id: slot.id,
      taId: slot.taId,
      taName: slot.ta.name,
      date: slot.date.toISOString().split('T')[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount,
      availableSeats: slot.capacity - slot.bookedCount,
    }));

    return {
      course: {
        id: course.id,
        code: course.code,
        name: course.name,
        description: course.description,
      },
      products,
      tas,
      upcomingGroupSessions,
      activeStudentBundles,
      availability: availableSlots,
    };
  }

  async createCourse(dto: CreateCourseDto): Promise<any> {
    const course = await this.prisma.course.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description || null,
      },
      include: {
        products: true,
        tas: {
          include: { ta: true },
        },
      },
    });

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      tas: course.tas.map(ct => ({
        id: ct.ta.id,
        name: ct.ta.name,
        email: ct.ta.email,
      })),
      products: course.products,
      message: 'Course created successfully',
    };
  }

  async createCourseByTutor(dto: CreateCourseByTutorDto): Promise<any> {
    // Verify tutor exists
    const tutor = await this.prisma.ta.findUnique({
      where: { id: dto.taId },
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${dto.taId} not found`);
    }

    // Create course without auto-assignment
    const course = await this.prisma.course.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description || null,
      },
      include: {
        products: true,
        tas: true,
      },
    });

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      createdBy: {
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
      },
      message: 'Course created successfully',
    };
  }

  async assignTutorToCourse(requestingTaId: string, courseId: string, tutorId: string): Promise<any> {
    // Verify requesting tutor exists
    const requestingTutor = await this.prisma.ta.findUnique({
      where: { id: requestingTaId },
    });

    if (!requestingTutor) {
      throw new NotFoundException(`Tutor with ID ${requestingTaId} not found`);
    }

    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Verify tutor to assign exists
    const tutorToAssign = await this.prisma.ta.findUnique({
      where: { id: tutorId },
    });

    if (!tutorToAssign) {
      throw new NotFoundException(`Tutor with ID ${tutorId} not found`);
    }

    // Check if tutor already assigned
    const existing = await this.prisma.courseTA.findUnique({
      where: {
        courseId_taId: {
          courseId,
          taId: tutorId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('This tutor is already assigned to this course');
    }

    // Assign tutor to course
    await this.prisma.courseTA.create({
      data: {
        courseId,
        taId: tutorId,
      },
    });

    return {
      courseId: course.id,
      courseName: course.name,
      assignedTutor: {
        id: tutorToAssign.id,
        name: tutorToAssign.name,
        email: tutorToAssign.email,
      },
      assignedBy: {
        id: requestingTutor.id,
        name: requestingTutor.name,
      },
      message: 'Tutor assigned to course successfully',
    };
  }
}
