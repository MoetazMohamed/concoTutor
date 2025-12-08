import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, CreateCourseByTutorDto } from './courses.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Post()
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Post('tutor/:taId/create')
  async createCourseByTutor(
    @Param('taId') taId: string,
    @Body() dto: Omit<CreateCourseByTutorDto, 'taId'>,
  ) {
    return this.coursesService.createCourseByTutor({
      ...dto,
      taId,
    });
  }

  @Post('tutor/:taId/assign-tutor')
  async assignTutorToCourse(
    @Param('taId') requestingTaId: string,
    @Body() data: { courseId: string; tutorId: string },
  ) {
    return this.coursesService.assignTutorToCourse(requestingTaId, data.courseId, data.tutorId);
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
