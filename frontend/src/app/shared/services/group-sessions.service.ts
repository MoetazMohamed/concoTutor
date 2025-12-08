import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface GroupSession {
  id: string;
  templateId: string;
  courseId: string;
  taId: string;
  status: string;
  maxCapacity: number;
  currentStudentCount: number;
  sessionType: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroupSessionsService {
  constructor(private api: ApiService) {}

  getSessionsByCourse(courseId: string) {
    return this.api.get<GroupSession[]>(`/group-sessions/course/${courseId}`);
  }

  joinSession(sessionId: string, studentId: string) {
    return this.api.post(`/group-sessions/${sessionId}/join`, { studentId });
  }
}
