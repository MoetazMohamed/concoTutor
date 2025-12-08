import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async createAvailability(taId: string, dto: CreateAvailabilityDto) {
    // Verify TA exists
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
    });

    if (!ta) {
      throw new NotFoundException('TA not found');
    }

    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if TA is assigned to this course, if not, assign them
    const courseTA = await this.prisma.courseTA.findUnique({
      where: { courseId_taId: { courseId: dto.courseId, taId } },
    });

    if (!courseTA) {
      // Auto-assign TA to course when they add availability
      await this.prisma.courseTA.create({
        data: {
          courseId: dto.courseId,
          taId,
        },
      });
    }

    // Validate time format
    if (!this.isValidTimeFormat(dto.startTime) || !this.isValidTimeFormat(dto.endTime)) {
      throw new BadRequestException('Invalid time format. Use HH:mm');
    }

    // Parse and validate date
    const availabilityDate = new Date(dto.date);
    if (isNaN(availabilityDate.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    // Ensure date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (availabilityDate < today) {
      throw new BadRequestException('Cannot create availability for past dates');
    }

    return this.prisma.tAAvailability.create({
      data: {
        taId,
        courseId: dto.courseId,
        date: availabilityDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        capacity: dto.capacity,
      },
      include: {
        course: true,
        ta: true,
      },
    });
  }

  async getAvailabilityByTA(taId: string) {
    return this.prisma.tAAvailability.findMany({
      where: { taId, isActive: true },
      include: { course: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getAvailabilityByCourse(taId: string, courseId: string) {
    return this.prisma.tAAvailability.findMany({
      where: { taId, courseId, isActive: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getAvailabilityForCourse(courseId: string) {
    return this.prisma.tAAvailability.findMany({
      where: { courseId, isActive: true },
      include: { ta: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async updateAvailability(
    taId: string,
    slotId: string,
    dto: UpdateAvailabilityDto,
  ) {
    const slot = await this.prisma.tAAvailability.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException('Availability slot not found');
    }

    if (slot.taId !== taId) {
      throw new BadRequestException('Unauthorized');
    }

    if (dto.startTime && !this.isValidTimeFormat(dto.startTime)) {
      throw new BadRequestException('Invalid start time format. Use HH:mm');
    }

    if (dto.endTime && !this.isValidTimeFormat(dto.endTime)) {
      throw new BadRequestException('Invalid end time format. Use HH:mm');
    }

    return this.prisma.tAAvailability.update({
      where: { id: slotId },
      data: dto,
    });
  }

  async deleteAvailability(taId: string, slotId: string) {
    const slot = await this.prisma.tAAvailability.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException('Availability slot not found');
    }

    if (slot.taId !== taId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.prisma.tAAvailability.delete({
      where: { id: slotId },
    });
  }

  async getAvailableSlots(courseId: string) {
    return this.prisma.tAAvailability.findMany({
      where: {
        courseId,
        isActive: true,
      },
      include: {
        ta: {
          select: {
            id: true,
            name: true,
            bio: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  private isValidTimeFormat(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  }
}
