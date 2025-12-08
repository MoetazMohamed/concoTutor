import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { BookingService } from '../../shared/services/booking.service';
import { AuthService } from '../../shared/services/auth.service';
import { StudentService } from '../../shared/services/student.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CourseDetail {
  id: string;
  code: string;
  name: string;
  description: string;
  tas: Array<{ id: string; name: string; email: string; bio?: string }>;
  products: any[];
  availability: Array<{
    id: string;
    taId: string;
    taName: string;
    date: string;
    startTime: string;
    endTime: string;
    capacity: number;
    bookedCount: number;
    availableSeats: number;
  }>;
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  course: CourseDetail | null = null;
  courseId: string | null = null;
  selectedSlot: any = null;
  creditsToUse: number = 0;
  studentCredits: any = null;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  bookingInProgress: boolean = false;

  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    eventClick: this.handleEventClick.bind(this),
    events: [],
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private bookingService: BookingService,
    private authService: AuthService,
    private studentService: StudentService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id');
      if (this.courseId) {
        this.loadCourseDetails(this.courseId);
        this.loadStudentCredits();
      }
    });
  }

  loadCourseDetails(id: string) {
    this.loading = true;
    this.coursesService.getCourseById(id).subscribe({
      next: (course: any) => {
        this.course = course;
        this.updateCalendarEvents();
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load course details';
        console.error(err);
        this.loading = false;
      },
    });
  }

  updateCalendarEvents() {
    if (!this.course) return;

    const events: EventInput[] = [];
    
    if (!this.course.availability || this.course.availability.length === 0) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: [],
      };
      return;
    }

    const today = new Date();

    // Generate events from availability slots
    this.course.availability.forEach((slot) => {
      const slotDate = new Date(slot.date);
      
      // Parse time
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);

      const startDateTime = new Date(slotDate);
      startDateTime.setHours(startHour, startMin, 0);

      const endDateTime = new Date(slotDate);
      endDateTime.setHours(endHour, endMin, 0);

      // Only show future events
      if (startDateTime > today) {
        events.push({
          id: slot.id,
          title: `${slot.taName} (${slot.availableSeats}/${slot.capacity} available)`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: slot.availableSeats > 0 ? '#667eea' : '#ccc',
          borderColor: slot.availableSeats > 0 ? '#764ba2' : '#999',
          extendedProps: {
            slotId: slot.id,
            taId: slot.taId,
            taName: slot.taName,
            availableSeats: slot.availableSeats,
            capacity: slot.capacity,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            bookable: slot.availableSeats > 0,
          },
        });
      }
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events,
    };
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    const props = event.extendedProps;

    if (!props['bookable']) {
      this.errorMessage = 'This session is fully booked';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.selectedSlot = {
      id: props['slotId'],
      taId: props['taId'],
      taName: props['taName'],
      date: props['date'],
      startTime: props['startTime'],
      endTime: props['endTime'],
      capacity: props['capacity'],
      availableSeats: props['availableSeats'],
      selectedDate: event.start,
    };
    
    this.creditsToUse = 1;
    this.errorMessage = '';
  }

  loadStudentCredits() {
    const user = this.authService.getUser();
    if (!user) return;

    this.studentService.getCredits(user.id).subscribe({
      next: (credits: any) => {
        this.studentCredits = credits;
      },
      error: (err: any) => {
        console.error('Failed to load credits', err);
      },
    });
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
    this.creditsToUse = 1; // Default to 1 credit per session
    this.errorMessage = '';
  }

  bookSlot() {
    if (!this.selectedSlot || !this.course || !this.creditsToUse) {
      this.errorMessage = 'Please select a slot and credits to use';
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isStudent()) {
      this.errorMessage = 'Only students can book sessions';
      return;
    }

    const availableCredits = this.studentCredits.totalCredits - this.studentCredits.usedCredits;
    if (availableCredits < this.creditsToUse) {
      this.errorMessage = `Insufficient credits. You have ${availableCredits} but need ${this.creditsToUse}`;
      return;
    }

    this.bookingInProgress = true;
    const bookingDto = {
      studentId: user.id,
      taId: this.selectedSlot.taId,
      courseId: this.course.id,
      availabilitySlotId: this.selectedSlot.id,
      creditsToUse: this.creditsToUse,
      selectedDate: this.selectedSlot.selectedDate,
    };

    this.bookingService.bookAvailabilitySlot(bookingDto).subscribe({
      next: (response: any) => {
        this.successMessage = `Session booked successfully for ${this.selectedSlot.selectedDate.toLocaleDateString()}! Credits used: ${response.creditsUsed}, Remaining: ${response.remainingCredits}`;
        this.selectedSlot = null;
        this.bookingInProgress = false;
        this.loadCourseDetails(this.course!.id);
        this.loadStudentCredits();
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Booking failed';
        this.bookingInProgress = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}
