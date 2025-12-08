import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface CourseDetails extends Course {
  products: any[];
  tas: any[];
  groupSessions: any[];
  activeBundles: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private api: ApiService) {}

  getCourses() {
    return this.api.get<Course[]>('/courses');
  }

  getCourseById(id: string) {
    return this.api.get<CourseDetails>(`/courses/${id}`);
  }

  getSupportOptions(courseId: string) {
    return this.api.get(`/courses/${courseId}/support-options`);
  }
}
