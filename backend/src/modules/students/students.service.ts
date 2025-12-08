import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddCreditsDto, UseCreditsDto } from './dto/credits.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getProfile(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        email: true,
        name: true,
        totalCredits: true,
        usedCredits: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      ...student,
      availableCredits: student.totalCredits - student.usedCredits,
    };
  }

  async getCredits(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        totalCredits: true,
        usedCredits: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      studentId: student.id,
      totalCredits: student.totalCredits,
      usedCredits: student.usedCredits,
      availableCredits: student.totalCredits - student.usedCredits,
    };
  }

  // Internal method for adding credits (used by booking/purchase system only)
  async addCreditsInternal(studentId: string, amount: number, reason: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        totalCredits: student.totalCredits + amount,
      },
    });

    await this.prisma.creditTransaction.create({
      data: {
        studentId,
        amount,
        type: 'ADD',
        reason,
      },
    });

    return updated;
  }

  // Internal method for deducting credits (used by booking system only)
  async deductCreditsInternal(studentId: string, amount: number, reason: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        usedCredits: student.usedCredits + amount,
      },
    });

    await this.prisma.creditTransaction.create({
      data: {
        studentId,
        amount,
        type: 'DEDUCT',
        reason,
      },
    });

    return updated;
  }

  async addCredits(studentId: string, dto: AddCreditsDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Update student credits
    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        totalCredits: student.totalCredits + dto.amount,
      },
    });

    // Log transaction
    await this.prisma.creditTransaction.create({
      data: {
        studentId,
        amount: dto.amount,
        type: 'ADD',
        reason: 'Credits added to account',
      },
    });

    return {
      studentId: updated.id,
      totalCredits: updated.totalCredits,
      usedCredits: updated.usedCredits,
      availableCredits: updated.totalCredits - updated.usedCredits,
    };
  }

  async useCredits(studentId: string, dto: UseCreditsDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const availableCredits = student.totalCredits - student.usedCredits;
    if (availableCredits < dto.amount) {
      throw new BadRequestException('Insufficient credits');
    }

    // Update student credits
    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        usedCredits: student.usedCredits + dto.amount,
      },
    });

    // Log transaction
    await this.prisma.creditTransaction.create({
      data: {
        studentId,
        amount: -dto.amount,
        type: 'DEDUCT',
        reason: dto.reason || 'Credits used for booking',
      },
    });

    return {
      studentId: updated.id,
      totalCredits: updated.totalCredits,
      usedCredits: updated.usedCredits,
      availableCredits: updated.totalCredits - updated.usedCredits,
    };
  }

  async refundCredits(studentId: string, amount: number, reason: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        usedCredits: Math.max(0, student.usedCredits - amount),
      },
    });

    await this.prisma.creditTransaction.create({
      data: {
        studentId,
        amount,
        type: 'REFUND',
        reason: reason || 'Credits refunded',
      },
    });

    return {
      studentId: updated.id,
      totalCredits: updated.totalCredits,
      usedCredits: updated.usedCredits,
      availableCredits: updated.totalCredits - updated.usedCredits,
    };
  }

  async getCreditHistory(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.creditTransaction.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookings(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.bookingStudent.findMany({
      where: { studentId },
      include: {
        booking: {
          include: {
            course: true,
            ta: true,
            groupSessionTemplate: true,
          },
        },
      },
    });
  }

  async updateProfile(studentId: string, data: any) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.student.update({
      where: { id: studentId },
      data: {
        name: data.name || student.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        totalCredits: true,
        usedCredits: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
