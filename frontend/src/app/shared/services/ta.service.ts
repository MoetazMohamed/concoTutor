import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface TAProfile {
  id: string;
  email: string;
  name: string;
  courses: any[];
  availabilitySlots: AvailabilitySlot[];
  createdAt: Date;
}

export interface AvailabilitySlot {
  id: string;
  taId: string;
  courseId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string;
  capacity: number;
  bookedCount: number;
}

export interface CreateAvailabilityDto {
  courseId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string;
  endTime: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaService {
  constructor(private api: ApiService) {}

  getProfile(taId: string) {
    return this.api.get<TAProfile>(`/tas/${taId}`);
  }

  getAvailability(taId: string) {
    return this.api.get<AvailabilitySlot[]>(`/tas/${taId}/availability`);
  }

  getAvailabilityByCourse(taId: string, courseId: string) {
    return this.api.get<AvailabilitySlot[]>(
      `/tas/${taId}/courses/${courseId}/availability`
    );
  }

  createAvailability(taId: string, dto: CreateAvailabilityDto) {
    return this.api.post(
      `/tas/${taId}/availability`,
      dto
    );
  }

  updateAvailability(taId: string, slotId: string, dto: Partial<CreateAvailabilityDto>) {
    return this.api.patch(
      `/tas/${taId}/availability/${slotId}`,
      dto
    );
  }

  deleteAvailability(taId: string, slotId: string) {
    return this.api.delete(`/tas/${taId}/availability/${slotId}`);
  }

  getAssignedCourses(taId: string) {
    return this.api.get(`/tas/${taId}/courses`);
  }

  getStudentBookings(taId: string, courseId: string) {
    return this.api.get(`/tas/${taId}/courses/${courseId}/bookings`);
  }
  
  // Create a course as a tutor
  createCourseByTutor(taId: string, dto: { name: string; code: string; description?: string }) {
    return this.api.post(`/courses/tutor/${taId}/create`, dto);
  }

  // Assign a tutor to an existing course
  assignTutorToCourse(taId: string, courseId: string, tutorId: string) {
    return this.api.post(`/courses/tutor/${taId}/assign-tutor`, { courseId, tutorId });
  }

  // Create a new tutor by an existing tutor
  createTutorByTutor(creatorTaId: string, dto: { email: string; password: string; name: string; degree?: string }) {
    return this.api.post(`/tas/${creatorTaId}/create-tutor`, dto);
  }

  // Get all tutors (useful for assigning)
  getAllTAs() {
    return this.api.get(`/tas`);
  }
}
