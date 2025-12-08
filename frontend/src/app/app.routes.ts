import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { BookingComponent } from './pages/booking/booking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'course-details/:id', component: CourseDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: '**', redirectTo: '' },
];
