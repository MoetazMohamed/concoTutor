import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  userType: 'student' | 'ta' = 'student';
  degree: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
    // Validation
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
      userType: this.userType,
      degree: this.userType === 'ta' ? this.degree : undefined,
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! You are now logged in.';
        setTimeout(() => {
          if (this.userType === 'student') {
            this.router.navigate(['/student-dashboard']);
          } else {
            this.router.navigate(['/ta-dashboard']);
          }
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }

  toggleUserType(type: 'student' | 'ta'): void {
    this.userType = type;
    this.errorMessage = '';
  }
}
