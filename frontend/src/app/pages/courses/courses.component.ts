import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent, Course } from '../../components/course-card/course-card.component';
import { CoursesService } from '../../shared/services/courses.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.error = null;
    this.coursesService.getCourses().subscribe({
      next: (data: any) => {
        this.courses = data.map((course: any) => ({
          id: course.id,
          title: course.name,
          description: course.description,
          price: 99,
          instructor: 'Course Team',
          duration: '12 weeks',
          level: 'Advanced'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error = 'Failed to load courses. Please try again.';
        this.loading = false;
        // Fallback to sample data
        this.courses = [
          {
            id: 1,
            title: 'Advanced Mathematics',
            description: 'Master advanced concepts in calculus and algebra',
            price: 99,
            instructor: 'Ahmed Mohamed',
            duration: '12 weeks',
            level: 'Advanced'
          },
          {
            id: 2,
            title: 'English Literature',
            description: 'Explore classic and contemporary literature',
            price: 79,
            instructor: 'Fatima Hassan',
            duration: '10 weeks',
            level: 'Intermediate'
          },
          {
            id: 3,
            title: 'Physics Fundamentals',
            description: 'Learn the basics of physics and mechanics',
            price: 89,
            instructor: 'Omar Ali',
            duration: '14 weeks',
            level: 'Beginner'
          },
          {
            id: 4,
            title: 'Chemistry Lab Techniques',
            description: 'Hands-on chemistry experiments and lab work',
            price: 109,
            instructor: 'Layla Ahmed',
            duration: '8 weeks',
            level: 'Intermediate'
          },
          {
            id: 5,
            title: 'Biology and Genetics',
            description: 'Understanding the fundamentals of biology',
            price: 85,
            instructor: 'Hassan Ibrahim',
            duration: '11 weeks',
            level: 'Beginner'
          },
          {
            id: 6,
            title: 'Computer Science Basics',
            description: 'Introduction to programming and algorithms',
            price: 95,
            instructor: 'Mona Khalil',
            duration: '10 weeks',
            level: 'Beginner'
          }
        ];
      }
    });
  }

  onCourseSelected(course: Course) {
    console.log('Course selected:', course);
  }
}

