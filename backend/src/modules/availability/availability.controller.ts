import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/availability.dto';

@Controller('tas')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post(':taId/availability')
  async createAvailability(
    @Param('taId') taId: string,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.createAvailability(taId, dto);
  }

  @Get(':taId/availability')
  async getAvailability(@Param('taId') taId: string) {
    return this.availabilityService.getAvailabilityByTA(taId);
  }

  @Get(':taId/courses/:courseId/availability')
  async getAvailabilityByCourse(
    @Param('taId') taId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.availabilityService.getAvailabilityByCourse(taId, courseId);
  }

  @Patch(':taId/availability/:slotId')
  async updateAvailability(
    @Param('taId') taId: string,
    @Param('slotId') slotId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.updateAvailability(taId, slotId, dto);
  }

  @Delete(':taId/availability/:slotId')
  async deleteAvailability(
    @Param('taId') taId: string,
    @Param('slotId') slotId: string,
  ) {
    return this.availabilityService.deleteAvailability(taId, slotId);
  }

  @Get('courses/:courseId/availability')
  async getAvailableSlots(@Param('courseId') courseId: string) {
    return this.availabilityService.getAvailableSlots(courseId);
  }
}
