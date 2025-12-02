import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.css']
})
export class TutorsComponent {
  tutors = [
    { id: 1, name: 'Ahmed Mohamed', expertise: 'Mathematics' },
    { id: 2, name: 'Fatima Hassan', expertise: 'English' },
    { id: 3, name: 'Omar Ali', expertise: 'Science' }
  ];
}
