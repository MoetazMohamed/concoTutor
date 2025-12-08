import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  userType: 'student' | 'ta' = 'student';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      if (this.authService.isStudent()) {
        this.router.navigate(['/student-dashboard']);
      } else {
        this.router.navigate(['/ta-dashboard']);
      }
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.email, this.password, this.userType).subscribe({
      next: (response) => {
        this.successMessage = `Welcome ${response.user.name}!`;
        setTimeout(() => {
          if (this.userType === 'student') {
            this.router.navigate(['/student-dashboard']);
          } else {
            this.router.navigate(['/ta-dashboard']);
          }
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      },
    });
  }

  toggleUserType(type: 'student' | 'ta'): void {
    this.userType = type;
    this.errorMessage = '';
  }
}
