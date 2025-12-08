import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TAsService } from './tas.service';

@Controller('tas')
export class TAsController {
  constructor(private tasService: TAsService) {}

  @Get()
  async getAllTAs() {
    return this.tasService.getAllTAs();
  }

  @Get(':taId')
  async getProfile(@Param('taId') taId: string) {
    return this.tasService.getProfile(taId);
  }

  @Get(':taId/availability')
  async getAvailability(@Param('taId') taId: string) {
    return this.tasService.getAvailability(taId);
  }

  @Get(':taId/courses')
  async getAssignedCourses(@Param('taId') taId: string) {
    return this.tasService.getAssignedCourses(taId);
  }

  @Get(':taId/courses/:courseId/bookings')
  async getStudentBookings(
    @Param('taId') taId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.tasService.getStudentBookings(taId, courseId);
  }

  @Post(':taId/create-tutor')
  async createTutor(
    @Param('taId') creatorTaId: string,
    @Body() data: { email: string; password: string; name: string; degree?: string },
  ) {
    return this.tasService.createTutorByTutor(creatorTaId, data);
  }

  @Patch(':taId')
  async updateProfile(
    @Param('taId') taId: string,
    @Body() data: any,
  ) {
    return this.tasService.updateProfile(taId, data);
  }
}
