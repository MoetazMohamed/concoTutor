import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { BookingComponent } from './pages/booking/booking.component';
import { LoginComponent } from './shared/auth/login.component';
import { RegisterComponent } from './shared/auth/register.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { TaDashboardComponent } from './pages/ta-dashboard/ta-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'ta-dashboard', component: TaDashboardComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'course-details/:id', component: CourseDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: '**', redirectTo: '' },
];
