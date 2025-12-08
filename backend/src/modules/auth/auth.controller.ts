import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UserType } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // Only allow student registration via public endpoint
    if (dto.type !== UserType.STUDENT) {
      throw new Error('Tutor registration is not allowed. Only students can register publicly.');
    }
    return this.authService.register(dto);
  }

  @Post('login/student')
  async loginStudent(@Body() dto: LoginDto) {
    return this.authService.login(dto, UserType.STUDENT);
  }

  @Post('login/ta')
  async loginTA(@Body() dto: LoginDto) {
    return this.authService.login(dto, UserType.TA);
  }
}
