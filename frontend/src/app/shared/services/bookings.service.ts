import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface CreateBookingDto {
  studentId: string;
  courseId: string;
  productId: string;
  taId: string;
  sessionCount: number;
}

export interface Booking {
  id: string;
  studentId: string;
  taId: string;
  courseId: string;
  productId: string;
  sessionCount: number;
  status: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(private api: ApiService) {}

  createBooking(dto: CreateBookingDto) {
    return this.api.post<Booking>('/bookings/individual', dto);
  }

  getStudentBookings(studentId: string) {
    return this.api.get<Booking[]>(`/bookings/student/${studentId}`);
  }

  getTaBookings(taId: string) {
    return this.api.get<Booking[]>(`/bookings/ta/${taId}`);
  }

  cancelBooking(bookingId: string) {
    return this.api.patch<Booking>(`/bookings/${bookingId}/cancel`, {});
  }
}
