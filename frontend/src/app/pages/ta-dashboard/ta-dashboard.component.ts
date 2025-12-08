import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaService } from '../../shared/services/ta.service';
import { AuthService } from '../../shared/services/auth.service';
import { CoursesService } from '../../shared/services/courses.service';

@Component({
  selector: 'app-ta-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ta-dashboard.component.html',
  styleUrls: ['./ta-dashboard.component.css'],
})
export class TaDashboardComponent implements OnInit {
  taName: string = '';
  courses: any[] = [];
  allCourses: any[] = [];
  availability: any[] = [];
  bookings: any[] = [];
  selectedCourse: string = '';
  showAddAvailability: boolean = false;
  showCreateCourse: boolean = false;
  showAssignTutor: boolean = false;
  showCreateTutor: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  // Form data for new availability
  newAvailability = {
    courseId: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 5,
  };

  // Form for creating a new course
  newCourse = {
    name: '',
    code: '',
    description: '',
  };

  // Form for assigning a tutor
  tutorsList: any[] = [];
  assignTutorData = {
    courseId: '',
    tutorId: '',
  };

  // Form for creating a new tutor
  newTutor = {
    email: '',
    password: '',
    name: '',
    degree: '',
  };

  constructor(
    private taService: TaService,
    private authService: AuthService,
    private router: Router,
    private coursesService: CoursesService,
  ) {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    }
    this.taName = user?.name || 'Tutor';
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const user = this.authService.getUser();
    if (!user) return;

    // Load assigned courses
    this.taService.getAssignedCourses(user.id).subscribe({
      next: (courses: any) => {
        this.courses = Array.isArray(courses) ? courses : [];
        this.loading = false;
        if (this.courses.length > 0) {
          this.selectedCourse = this.courses[0].id;
          this.newAvailability.courseId = this.selectedCourse;
          this.loadAvailability(user.id);
          this.loadBookings(user.id);
        } else {
          this.loading = false;
        }
        // load all tutors for assign dropdown
        this.taService.getAllTAs().subscribe({ 
          next: (tas: any) => {
            this.tutorsList = Array.isArray(tas) ? tas : [];
          }, 
          error: () => (this.tutorsList = []) 
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load courses';
        console.error(err);
        this.loading = false;
      },
    });

    // Load all courses for assignment dropdown
    this.coursesService.getCourses().subscribe({
      next: (courses: any) => {
        this.allCourses = Array.isArray(courses) ? courses : [];
        if (this.allCourses.length === 0 && this.courses.length === 0) {
          this.errorMessage = 'No courses available. Create a course first.';
        }
      },
      error: (err: any) => {
        console.error('Failed to load all courses:', err);
        this.allCourses = [];
      },
    });
  }

  // Create a course as this tutor
  createCourse(): void {
    const user = this.authService.getUser();
    if (!user) return;

    if (!this.newCourse.name || !this.newCourse.code) {
      this.errorMessage = 'Please provide course name and code';
      return;
    }

    this.taService.createCourseByTutor(user.id, this.newCourse).subscribe({
      next: (course: any) => {
        this.successMessage = 'Course created successfully';
        this.showCreateCourse = false;
        this.newCourse = { name: '', code: '', description: '' };
        this.loadDashboard();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to create course';
      },
    });
  }

  assignTutor(): void {
    const user = this.authService.getUser();
    if (!user) return;
    if (!this.assignTutorData.tutorId || !this.assignTutorData.courseId) {
      this.errorMessage = 'Please select a tutor and course to assign';
      return;
    }

    this.taService.assignTutorToCourse(user.id, this.assignTutorData.courseId, this.assignTutorData.tutorId).subscribe({
      next: () => {
        this.successMessage = 'Tutor assigned to course successfully';
        this.showAssignTutor = false;
        this.assignTutorData.tutorId = '';
        this.loadDashboard();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to assign tutor';
      },
    });
  }

  createTutor(): void {
    const user = this.authService.getUser();
    if (!user) return;
    if (!this.newTutor.email || !this.newTutor.password || !this.newTutor.name) {
      this.errorMessage = 'Please fill required tutor fields';
      return;
    }

    this.taService.createTutorByTutor(user.id, this.newTutor).subscribe({
      next: (tutor: any) => {
        this.successMessage = 'Tutor created successfully';
        this.showCreateTutor = false;
        this.newTutor = { email: '', password: '', name: '', degree: '' };
        this.tutorsList.push(tutor);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to create tutor';
      },
    });
  }

  loadAvailability(taId: string): void {
    if (!this.selectedCourse) return;

    this.taService.getAvailabilityByCourse(taId, this.selectedCourse).subscribe({
      next: (slots: any) => {
        this.availability = slots;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadBookings(taId: string): void {
    if (!this.selectedCourse) return;

    this.taService.getStudentBookings(taId, this.selectedCourse).subscribe({
      next: (bookings: any) => {
        this.bookings = bookings;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  onCourseChange(): void {
    const user = this.authService.getUser();
    if (user && this.selectedCourse) {
      this.loading = true;
      this.newAvailability.courseId = this.selectedCourse;
      this.availability = [];
      this.bookings = [];
      this.loadAvailability(user.id);
      this.loadBookings(user.id);
    }
  }

  addAvailability(): void {
    const user = this.authService.getUser();
    if (!user) return;

    if (!this.selectedCourse) {
      this.errorMessage = 'Please select a course first';
      return;
    }

    // Ensure courseId is set from selected course
    this.newAvailability.courseId = this.selectedCourse;

    this.taService.createAvailability(user.id, this.newAvailability).subscribe({
      next: () => {
        this.successMessage = 'Availability added successfully!';
        this.showAddAvailability = false;
        this.resetForm();
        this.loadAvailability(user.id);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to add availability';
      },
    });
  }

  deleteAvailability(slotId: string): void {
    const user = this.authService.getUser();
    if (!user) return;

    if (confirm('Are you sure you want to delete this availability slot?')) {
      this.taService.deleteAvailability(user.id, slotId).subscribe({
        next: () => {
          this.successMessage = 'Availability deleted successfully!';
          this.loadAvailability(user.id);
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete availability';
        },
      });
    }
  }

  resetForm(): void {
    this.newAvailability = {
      courseId: this.selectedCourse,
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      capacity: 5,
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
