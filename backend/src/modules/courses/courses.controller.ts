import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Get(':id/support-options')
  async getCourseSupportOptions(
    @Param('id') courseId: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.coursesService.getCourseSupportOptions(courseId, studentId);
  }
}
