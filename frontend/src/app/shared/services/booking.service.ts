import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface BookingRequest {
  studentId: string;
  taId: string;
  courseId: string;
  availabilitySlotId: string;
  creditsToUse: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: any;
  creditsUsed: number;
  remainingCredits: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private api: ApiService) {}

  bookAvailabilitySlot(dto: BookingRequest) {
    return this.api.post<BookingResponse>('/bookings/availability-slot', dto);
  }

  getStudentBookings(studentId: string) {
    return this.api.get(`/bookings/students/${studentId}`);
  }

  getTABookings(taId: string) {
    return this.api.get(`/bookings/tas/${taId}`);
  }

  cancelBooking(bookingId: string, reason?: string) {
    return this.api.patch(`/bookings/${bookingId}/cancel`, { reason });
  }
}
