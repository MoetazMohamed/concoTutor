import { IsNumber, Min } from 'class-validator';

export class AddCreditsDto {
  @IsNumber()
  @Min(1)
  amount: number;
}

export class UseCreditsDto {
  @IsNumber()
  @Min(1)
  amount: number;

  reason?: string;
}
