import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNumber } from 'class-validator';

export enum UserType {
  STUDENT = 'student',
  TA = 'ta',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(UserType)
  type: UserType;

  @IsOptional()
  @IsString()
  degree?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
