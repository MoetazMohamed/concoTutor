import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';
import { SessionType } from '@prisma/client';

export class CreateIndividualBookingDto {
  @IsString()
  studentId!: string;

  @IsString()
  courseId!: string;

  @IsOptional()
  @IsString()
  taId?: string;

  @IsDateString()
  date!: string;

  @IsInt()
  durationMinutes!: number;

  @IsOptional()
  @IsString()
  bundlePurchaseId?: string;
}

export class BookingDto {
  id!: string;
  courseId!: string;
  taId!: string;
  status!: string;
  sessionType!: SessionType;
  date!: Date;
  durationMinutes!: number;
  pricePerStudent!: number;
  groupSessionTemplateId!: string | null;
  bundlePurchaseId!: string | null;
  studentCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class CancelBookingDto {
  reason?: string;
}
