import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateIndividualBookingDto,
  CancelBookingDto,
} from './bookings.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('individual')
  async createIndividualBooking(@Body() dto: CreateIndividualBookingDto) {
    return this.bookingsService.createIndividualBooking(dto);
  }

  @Get('students/:studentId')
  async getStudentBookings(@Param('studentId') studentId: string) {
    return this.bookingsService.getStudentBookings(studentId);
  }

  @Get('tas/:taId')
  async getTaBookings(@Param('taId') taId: string) {
    return this.bookingsService.getTaBookings(taId);
  }

  @Patch(':id/cancel')
  async cancelBooking(
    @Param('id') bookingId: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(bookingId);
  }
}
