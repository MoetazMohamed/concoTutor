import {
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { BundleCoverageType } from '@prisma/client';

export class CreateBundlePurchaseDto {
  @IsString()
  studentId!: string;

  @IsString()
  courseId!: string;

  @IsString()
  productId!: string;

  @IsEnum(BundleCoverageType)
  coverageType!: BundleCoverageType;

  @IsNumber()
  totalSessions!: number;

  @IsDateString()
  validFrom!: string;

  @IsDateString()
  validTo!: string;
}

export class BundlePurchaseDto {
  id!: string;
  studentId!: string;
  courseId!: string;
  productId!: string;
  coverageType!: BundleCoverageType;
  totalSessions!: number;
  remainingSessions!: number;
  validFrom!: Date;
  validTo!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
