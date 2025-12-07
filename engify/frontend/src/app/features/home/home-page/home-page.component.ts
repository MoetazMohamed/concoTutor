import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { TutorsSectionComponent } from '../tutors-section/tutors-section.component';
import { ContactSectionComponent } from '../contact-section/contact-section.component';
import { CourseCardComponent, Course } from '../../../components/course-card/course-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    AboutSectionComponent,
    TutorsSectionComponent,
    ContactSectionComponent,
    CourseCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  featuredCourses: Course[] = [
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
    }
  ];

  onCourseSelected(course: Course) {
    console.log('Course selected:', course);
  }
}
