import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../shared/services/student.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  totalCredits: number = 0;
  usedCredits: number = 0;
  availableCredits: number = 0;
  bookings: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
  ) {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    }
    this.studentName = user?.name || 'Student';
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const user = this.authService.getUser();
    if (!user) return;

    this.studentService.getCredits(user.id).subscribe({
      next: (credits: any) => {
        this.totalCredits = credits.totalCredits;
        this.usedCredits = credits.usedCredits;
        this.availableCredits = credits.availableCredits;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load credits information';
        console.error(err);
      },
    });

    this.studentService.getMyBookings(user.id).subscribe({
      next: (bookings: any) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load bookings';
        console.error(err);
        this.loading = false;
      },
    });
  }

  bookSession(): void {
    this.router.navigate(['/courses']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
