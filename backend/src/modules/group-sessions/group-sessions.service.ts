import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JoinGroupSessionDto } from './group-sessions.dto';
import { SessionType, Status } from '@prisma/client';

@Injectable()
export class GroupSessionsService {
  constructor(private prisma: PrismaService) {}

  async getGroupSessionsByCourse(courseId: string) {
    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Get group session templates and their active bookings
    const templates = await this.prisma.groupSessionTemplate.findMany({
      where: { courseId, isActive: true },
      include: { ta: true },
    });

    // For each template, get upcoming bookings
    const sessions = await Promise.all(
      templates.map(async (template) => {
        const bookings = await this.prisma.booking.findMany({
          where: {
            groupSessionTemplateId: template.id,
            sessionType: SessionType.GROUP,
          },
          include: { students: { include: { student: true } } },
          orderBy: { date: 'asc' },
        });

        return {
          template,
          bookings: bookings.map((b) => ({
            ...b,
            studentCount: b.students.length,
            capacity: template.capacity,
          })),
        };
      }),
    );

    return sessions;
  }

  async joinGroupSession(
    bookingId: string,
    dto: JoinGroupSessionDto,
  ) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${dto.studentId} not found`,
      );
    }

    // Get booking with template info
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        students: true,
        groupSessionTemplate: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Validate booking is a group session
    if (booking.sessionType !== SessionType.GROUP) {
      throw new BadRequestException('This booking is not a group session');
    }

    // Validate booking has a template
    if (!booking.groupSessionTemplate) {
      throw new BadRequestException('Group session template not found');
    }

    // Check if student already in this booking
    const existingBookingStudent = booking.students.find(
      (bs) => bs.studentId === dto.studentId,
    );
    if (existingBookingStudent) {
      throw new BadRequestException('Student already joined this session');
    }

    // Check capacity
    const currentStudentCount = booking.students.length;
    if (currentStudentCount >= booking.groupSessionTemplate.capacity) {
      throw new BadRequestException('Group session is at full capacity');
    }

    // Add student to booking
    await this.prisma.bookingStudent.create({
      data: {
        bookingId,
        studentId: dto.studentId,
      },
    });

    // Update booking status if now at capacity
    const updatedStudentCount = currentStudentCount + 1;
    if (updatedStudentCount >= booking.groupSessionTemplate.capacity) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: Status.FULL },
      });
    }

    return { success: true, message: 'Successfully joined group session' };
  }
}
