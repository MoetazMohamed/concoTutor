import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { BookingsService } from '../../shared/services/bookings.service';
import { CoursesService } from '../../shared/services/courses.service';
import { GroupSessionsService } from '../../shared/services/group-sessions.service';

interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  instructor: string;
  availableSeats: number;
  courseId: number;
  bundle: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  selectedSession: any = null;
  bookingConfirmed = false;
  courseId: string | null = null;
  selectedBundle: string | null = null;
  courseName: string = '';
  allSessions: Session[] = [];
  loading = true;
  error: string | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDisplay: 'block'
  };

  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private coursesService: CoursesService,
    private groupSessionsService: GroupSessionsService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'] || null;
      this.selectedBundle = params['bundle'] || null;
      if (this.courseId) {
        this.loadCourseData();
        this.loadSessions();
      }
    });
  }

  loadCourseData() {
    if (!this.courseId) return;
    
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (course: any) => {
        this.courseName = course.name;
      },
      error: (err) => {
        console.error('Error loading course:', err);
      }
    });
  }

  loadSessions() {
    if (!this.courseId) return;

    this.loading = true;
    this.error = null;
    
    this.groupSessionsService.getSessionsByCourse(this.courseId).subscribe({
      next: (sessions: any) => {
        this.allSessions = sessions.map((session: any) => ({
          id: session.id,
          title: this.courseName || 'Session',
          start: new Date(session.createdAt),
          end: new Date(new Date(session.createdAt).getTime() + 3600000),
          backgroundColor: '#007bff',
          borderColor: '#0056b3',
          instructor: 'Course TA',
          availableSeats: session.maxCapacity - session.currentStudentCount,
          courseId: parseInt(this.courseId || '0'),
          bundle: this.selectedBundle || 'Standard'
        }));
        
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.allSessions.map(s => ({
            id: s.id,
            title: s.title,
            start: s.start,
            end: s.end,
            backgroundColor: s.backgroundColor,
            borderColor: s.borderColor,
            extendedProps: { ...s }
          }))
        };
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
        this.error = 'Failed to load sessions';
        this.loading = false;
      }
    });
  }

  handleEventClick(arg: EventClickArg) {
    const event = arg.event;
    this.selectedSession = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      instructor: event.extendedProps['instructor'],
      availableSeats: event.extendedProps['availableSeats'],
      bundle: event.extendedProps['bundle']
    };
    this.bookingConfirmed = false;
  }

  confirmBooking() {
    if (!this.selectedSession) {
      alert('Please select a session');
      return;
    }

    const bookingDto = {
      studentId: 'student-1',
      courseId: this.courseId || '',
      productId: 'product-1',
      taId: 'ta-1',
      sessionCount: 1
    };

    this.bookingsService.createBooking(bookingDto).subscribe({
      next: (booking: any) => {
        this.bookingConfirmed = true;
        alert('Booking confirmed! Booking ID: ' + booking.id);
      },
      error: (err) => {
        console.error('Error creating booking:', err);
        alert('Failed to create booking. Please try again.');
      }
    });
  }

  cancelSelection() {
    this.selectedSession = null;
    this.bookingConfirmed = false;
  }
}

