import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto, UserType } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existingUser = 
      dto.type === UserType.STUDENT
        ? await this.prisma.student.findUnique({ where: { email: dto.email } })
        : await this.prisma.ta.findUnique({ where: { email: dto.email } });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    if (dto.type === UserType.STUDENT) {
      const initialCredits = 50; // Fixed initial credits for all new students
      const student = await this.prisma.student.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          totalCredits: initialCredits,
          usedCredits: 0,
        },
      });

      // Log initial credits transaction
      await this.prisma.creditTransaction.create({
        data: {
          studentId: student.id,
          amount: initialCredits,
          type: 'ADD',
          reason: 'Initial credits on registration',
        },
      });

      return {
        user: {
          id: student.id,
          email: student.email,
          name: student.name,
          type: UserType.STUDENT,
          credits: student.totalCredits,
        },
        token: this.generateToken(student.id, UserType.STUDENT),
      };
    } else {
      const ta = await this.prisma.ta.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          degree: dto.degree || 'Not specified',
          gpa: 0,
          bio: 'Tutor',
        },
      });

      return {
        user: {
          id: ta.id,
          email: ta.email,
          name: ta.name,
          type: UserType.TA,
        },
        token: this.generateToken(ta.id, UserType.TA),
      };
    }
  }

  async login(dto: LoginDto, type: UserType) {
    const user =
      type === UserType.STUDENT
        ? await this.prisma.student.findUnique({ where: { email: dto.email } })
        : await this.prisma.ta.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    if (type === UserType.STUDENT) {
      const student = user as any;
      return {
        user: {
          id: student.id,
          email: student.email,
          name: student.name,
          type: UserType.STUDENT,
          credits: student.totalCredits,
        },
        token: this.generateToken(student.id, UserType.STUDENT),
      };
    } else {
      const ta = user as any;
      return {
        user: {
          id: ta.id,
          email: ta.email,
          name: ta.name,
          type: UserType.TA,
        },
        token: this.generateToken(ta.id, UserType.TA),
      };
    }
  }

  private generateToken(userId: string, type: UserType): string {
    // Simple token generation - in production use JWT
    return Buffer.from(`${userId}:${type}:${Date.now()}`).toString('base64');
  }
}
