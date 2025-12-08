import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateAvailabilityDto {
  @IsString()
  courseId: string;

  @IsString()
  date: string; // ISO date string (YYYY-MM-DD)

  @IsString()
  startTime: string; // HH:mm format

  @IsString()
  endTime: string; // HH:mm format

  @IsNumber()
  @Min(1)
  capacity: number;
}

export class UpdateAvailabilityDto {
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsString()
  startTime?: string;

  @IsString()
  endTime?: string;
}
