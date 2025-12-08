import { IsString } from 'class-validator';

export class JoinGroupSessionDto {
  @IsString()
  studentId!: string;
}

export class GroupSessionTemplateDto {
  id!: string;
  courseId!: string;
  taId!: string;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  capacity!: number;
  pricePerStudent!: number;
  isActive!: boolean;
}

export class GroupSessionBookingDto {
  id!: string;
  courseId!: string;
  taId!: string;
  status!: string;
  sessionType!: string;
  date!: Date;
  durationMinutes!: number;
  pricePerStudent!: number;
  groupSessionTemplateId!: string | null;
  bundlePurchaseId!: string | null;
  studentCount!: number;
  capacity!: number;
}
