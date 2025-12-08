import { Component } from '@angular/core';
import { TutorCardComponent } from '../tutor-card/tutor-card.component';
import { Tutor } from '../../../shared/model/tutor.model';

@Component({
  selector: 'app-tutors-section',
  standalone: true,
  imports: [TutorCardComponent],
  templateUrl: './tutors-section.component.html',
  styleUrls: ['./tutors-section.component.scss'],
})
export class TutorsSectionComponent {
  tutors: Tutor[] = [
    {
      name: 'Sarah Jenkins',
      role: 'JMSB Specialist',
      bio: '4th Year Finance. Expert in COMM 220 & 308.',
      experience: '3 Years Experience',
      imageUrl: 'https://via.placeholder.com/150',
      ctaLabel: 'Book Sarah',
    },
    {
      name: 'Marc Tremblay',
      role: 'Engineering (Gina Cody)',
      bio: 'Masters in CS. Expert in COMP 248, 249 & SOEN.',
      experience: 'TA Experience',
      imageUrl: 'https://via.placeholder.com/150',
      ctaLabel: 'Book Marc',
    },
    {
      name: 'Jessica Lee',
      role: 'Math & Stats',
      bio: 'PhD Candidate. Expert in MATH 203, 204, 205.',
      experience: '5 Years Experience',
      imageUrl: 'https://via.placeholder.com/150',
      ctaLabel: 'Book Jessica',
    },
  ];
}
