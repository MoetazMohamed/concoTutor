import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  credits: number;
  createdAt: Date;
  bookings: any[];
}

export interface StudentCredits {
  studentId: string;
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private api: ApiService) {}

  getProfile(studentId: string) {
    return this.api.get<StudentProfile>(`/students/${studentId}`);
  }

  getCredits(studentId: string) {
    return this.api.get<StudentCredits>(`/students/${studentId}/credits`);
  }

  updateProfile(studentId: string, data: any) {
    return this.api.patch(`/students/${studentId}`, data);
  }

  getMyBookings(studentId: string) {
    return this.api.get(`/students/${studentId}/bookings`);
  }

  addCredits(studentId: string, amount: number) {
    return this.api.post(`/students/${studentId}/credits/add`, { amount });
  }
}
