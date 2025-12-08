import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TAsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(taId: string) {
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!ta) {
      throw new NotFoundException('TA not found');
    }

    return {
      id: ta.id,
      email: ta.email,
      name: ta.name,
      degree: ta.degree,
      gpa: ta.gpa,
      bio: ta.bio,
      courses: ta.courses.map(ct => ct.course),
      createdAt: ta.createdAt,
      updatedAt: ta.updatedAt,
    };
  }

  async getAvailability(taId: string) {
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
    });

    if (!ta) {
      throw new NotFoundException('TA not found');
    }

    return this.prisma.tAAvailability.findMany({
      where: { taId, isActive: true },
      include: { course: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getAssignedCourses(taId: string) {
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
    });

    if (!ta) {
      throw new NotFoundException('TA not found');
    }

    const courseTAs = await this.prisma.courseTA.findMany({
      where: { taId },
      include: { course: true },
    });

    return courseTAs.map(ct => ({
      id: ct.course.id,
      code: ct.course.code,
      name: ct.course.name,
      description: ct.course.description,
    }));
  }

  async updateProfile(taId: string, data: any) {
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
    });

    if (!ta) {
      throw new NotFoundException('TA not found');
    }

    return this.prisma.ta.update({
      where: { id: taId },
      data: {
        name: data.name || ta.name,
        degree: data.degree || ta.degree,
        gpa: data.gpa || ta.gpa,
        bio: data.bio || ta.bio,
      },
    });
  }

  async getStudentBookings(taId: string, courseId: string) {
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
    });

    if (!ta) {
      throw new NotFoundException('TA not found');
    }

    return this.prisma.booking.findMany({
      where: {
        taId,
        courseId,
      },
      include: {
        students: {
          include: { student: true },
        },
        course: true,
      },
    });
  }

  async getAllTAs() {
    return this.prisma.ta.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        degree: true,
        gpa: true,
        bio: true,
      },
    });
  }

  async createTutorByTutor(creatorTaId: string, data: { email: string; password: string; name: string; degree?: string }) {
    // Verify creator is a tutor
    const creator = await this.prisma.ta.findUnique({
      where: { id: creatorTaId },
    });

    if (!creator) {
      throw new NotFoundException(`Creator tutor with ID ${creatorTaId} not found`);
    }

    // Check if email already exists
    const existingTa = await this.prisma.ta.findUnique({
      where: { email: data.email },
    });

    if (existingTa) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new tutor
    const newTutor = await this.prisma.ta.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        degree: data.degree || 'Not specified',
        gpa: 0,
        bio: 'Tutor',
      },
    });

    return {
      id: newTutor.id,
      email: newTutor.email,
      name: newTutor.name,
      degree: newTutor.degree,
      createdBy: {
        id: creator.id,
        name: creator.name,
      },
      message: 'New tutor created successfully',
    };
  }
}
