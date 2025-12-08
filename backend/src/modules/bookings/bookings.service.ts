import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateIndividualBookingDto } from './bookings.dto';
import { SessionType, Status, ProductType } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createIndividualBooking(dto: CreateIndividualBookingDto) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
    }

    const bookingDate = new Date(dto.date);

    // If taId not specified, pick any available TA for this course
    let taId = dto.taId;
    if (!taId) {
      const availableTa = await this.prisma.courseTA.findFirst({
        where: { courseId: dto.courseId },
        include: { ta: true },
      });
      if (!availableTa) {
        throw new BadRequestException(
          'No TAs available for this course',
        );
      }
      taId = availableTa.taId;
    } else {
      // Verify TA teaches this course
      const courseTA = await this.prisma.courseTA.findUnique({
        where: {
          courseId_taId: {
            courseId: dto.courseId,
            taId,
          },
        },
      });
      if (!courseTA) {
        throw new BadRequestException(
          'This TA does not teach this course',
        );
      }
    }

    // Check for overlapping bookings for this TA at this time
    const endTime = new Date(
      bookingDate.getTime() + dto.durationMinutes * 60000,
    );
    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        taId,
        date: {
          gte: bookingDate,
          lt: endTime,
        },
        status: { not: Status.CANCELLED },
      },
    });

    if (overlappingBooking) {
      throw new BadRequestException(
        'This TA is not available at this time',
      );
    }

    // Determine price
    let price: number;
    let bundlePurchaseId: string | null = null;

    if (dto.bundlePurchaseId) {
      // Verify bundle purchase exists and is valid
      const bundle = await this.prisma.bundlePurchase.findUnique({
        where: { id: dto.bundlePurchaseId },
      });

      if (!bundle) {
        throw new NotFoundException(
          `Bundle purchase with ID ${dto.bundlePurchaseId} not found`,
        );
      }

      // Check bundle validity
      const now = new Date();
      if (
        bundle.studentId !== dto.studentId ||
        bundle.courseId !== dto.courseId ||
        bundle.validFrom > now ||
        bundle.validTo < now
      ) {
        throw new BadRequestException(
          'This bundle is not valid for this booking',
        );
      }

      // Check remaining sessions
      if (bundle.remainingSessions <= 0) {
        throw new BadRequestException(
          'No remaining sessions in this bundle',
        );
      }

      price = 0; // Bundle covers the cost
      bundlePurchaseId = dto.bundlePurchaseId;

      // Decrement remaining sessions
      await this.prisma.bundlePurchase.update({
        where: { id: dto.bundlePurchaseId },
        data: { remainingSessions: bundle.remainingSessions - 1 },
      });
    } else {
      // Get price from INDIVIDUAL_SESSION product
      const product = await this.prisma.product.findFirst({
        where: {
          courseId: dto.courseId,
          productType: ProductType.INDIVIDUAL_SESSION,
          isActive: true,
        },
      });

      if (!product) {
        throw new BadRequestException(
          'Individual session pricing not available for this course',
        );
      }

      price = typeof product.basePrice === 'number' 
        ? product.basePrice 
        : parseFloat(product.basePrice.toString());
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        courseId: dto.courseId,
        taId,
        status: Status.BOOKED,
        sessionType: SessionType.INDIVIDUAL,
        date: bookingDate,
        durationMinutes: dto.durationMinutes,
        pricePerStudent: price,
        bundlePurchaseId,
      },
    });

    // Add student to booking
    await this.prisma.bookingStudent.create({
      data: {
        bookingId: booking.id,
        studentId: dto.studentId,
      },
    });

    return booking;
  }

  async getStudentBookings(studentId: string) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        students: {
          some: {
            studentId,
          },
        },
      },
      include: {
        students: { include: { student: true } },
        ta: true,
        course: true,
      },
      orderBy: { date: 'desc' },
    });

    return bookings.map((b) => ({
      ...b,
      studentCount: b.students.length,
    }));
  }

  async getTaBookings(taId: string) {
    // Verify TA exists
    const ta = await this.prisma.ta.findUnique({
      where: { id: taId },
    });
    if (!ta) {
      throw new NotFoundException(`TA with ID ${taId} not found`);
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        taId,
      },
      include: {
        students: { include: { student: true } },
        course: true,
      },
      orderBy: { date: 'desc' },
    });

    return bookings.map((b) => ({
      ...b,
      studentCount: b.students.length,
    }));
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    if (booking.status === Status.CANCELLED) {
      throw new BadRequestException('This booking is already cancelled');
    }

    // If booking was from a bundle, refund the session
    if (booking.bundlePurchaseId) {
      await this.prisma.bundlePurchase.update({
        where: { id: booking.bundlePurchaseId },
        data: {
          remainingSessions: {
            increment: 1,
          },
        },
      });
    }

    // Cancel the booking
    const cancelled = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: Status.CANCELLED },
    });

    return cancelled;
  }
}
