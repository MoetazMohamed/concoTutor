import { Controller, Get, Param } from '@nestjs/common';
import { StudentService } from './students.service';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get(':studentId')
  async getProfile(@Param('studentId') studentId: string) {
    return this.studentService.getProfile(studentId);
  }

  @Get(':studentId/credits')
  async getCredits(@Param('studentId') studentId: string) {
    return this.studentService.getCredits(studentId);
  }

  @Get(':studentId/credits/history')
  async getCreditHistory(@Param('studentId') studentId: string) {
    return this.studentService.getCreditHistory(studentId);
  }

  @Get(':studentId/bookings')
  async getBookings(@Param('studentId') studentId: string) {
    return this.studentService.getBookings(studentId);
  }
}
