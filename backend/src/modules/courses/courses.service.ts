import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CourseDto, CourseSupportOptionsDto } from './courses.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(): Promise<CourseDto[]> {
    const courses = await this.prisma.course.findMany({
      orderBy: { code: 'asc' },
    });
    return courses;
  }

  async getCourseById(id: string): Promise<CourseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async getCourseSupportOptions(
    courseId: string,
    studentId?: string,
  ): Promise<CourseSupportOptionsDto> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Get products for this course
    const products = await this.prisma.product.findMany({
      where: { courseId, isActive: true },
    });

    // Get TAs for this course
    const courseTas = await this.prisma.courseTA.findMany({
      where: { courseId },
      include: { ta: true },
    });
    const tas = courseTas.map((ct) => ct.ta);

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

    return {
      course,
      products,
      tas,
      upcomingGroupSessions,
      activeStudentBundles,
    };
  }
}
