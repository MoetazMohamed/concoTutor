import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TutorsComponent } from '../../components/tutors/tutors.component';

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
  tutors: Array<{ id: number; name: string; expertise: string }>;
  bundles: string[];
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, TutorsComponent],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: CourseDetail | null = null;
  courseId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('id'));
      this.loadCourseDetails(this.courseId);
    });
  }

  loadCourseDetails(id: number) {
    const coursesData: { [key: number]: CourseDetail } = {
      1: {
        id: 1,
        title: 'Advanced Mathematics',
        description: 'Master advanced concepts in calculus and algebra',
        fullDescription: 'This comprehensive course covers advanced mathematical concepts including calculus, linear algebra, and differential equations. Perfect for students aiming to excel in engineering and science fields.',
        price: 99,
        instructor: 'Ahmed Mohamed',
        duration: '12 weeks',
        level: 'Advanced',
        tutors: [
          { id: 1, name: 'Ahmed Mohamed', expertise: 'Calculus' },
          { id: 2, name: 'Salma Hassan', expertise: 'Linear Algebra' }
        ],
        bundles: ['Bundle A: Calc + Algebra', 'Bundle B: All Math Courses', 'Bundle C: Math + Physics']
      },
      2: {
        id: 2,
        title: 'English Literature',
        description: 'Explore classic and contemporary literature',
        fullDescription: 'Dive deep into the world of literature with analysis of classic and modern works. Learn critical thinking and literary analysis techniques.',
        price: 79,
        instructor: 'Fatima Hassan',
        duration: '10 weeks',
        level: 'Intermediate',
        tutors: [
          { id: 3, name: 'Fatima Hassan', expertise: 'Classic Literature' }
        ],
        bundles: ['Bundle A: Lit + Writing', 'Bundle B: All Language Courses']
      },
      3: {
        id: 3,
        title: 'Physics Fundamentals',
        description: 'Learn the basics of physics and mechanics',
        fullDescription: 'Master the fundamental principles of physics, from kinematics to thermodynamics. Includes hands-on experiments and real-world applications.',
        price: 89,
        instructor: 'Omar Ali',
        duration: '14 weeks',
        level: 'Beginner',
        tutors: [
          { id: 4, name: 'Omar Ali', expertise: 'Mechanics' },
          { id: 5, name: 'Zahra Mohamed', expertise: 'Thermodynamics' }
        ],
        bundles: ['Bundle A: Physics Basics', 'Bundle B: Physics + Math']
      }
    };

    this.course = coursesData[id] || null;
  }

  bookCourse() {
    if (this.courseId) {
      this.router.navigate(['/booking']);
    }
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}
