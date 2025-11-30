import { Component } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { TutorsSectionComponent } from '../tutors-section/tutors-section.component';
import { ContactSectionComponent } from '../contact-section/contact-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    TutorsSectionComponent,
    ContactSectionComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {}
