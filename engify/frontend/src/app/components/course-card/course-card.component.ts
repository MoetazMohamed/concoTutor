import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
}

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input() course: Course | undefined;
  @Output() courseSelected = new EventEmitter<Course>();

  constructor(private router: Router) {}

  onSelectCourse() {
    if (this.course) {
      this.courseSelected.emit(this.course);
      this.router.navigate(['/course-details', this.course.id]);
    }
  }
}
