import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';

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
  courseId: number | null = null;
  selectedBundle: string | null = null;
  courseName: string = '';
  allSessions: Session[] = [];

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'] ? Number(params['courseId']) : null;
      this.selectedBundle = params['bundle'] || null;
      this.loadCourseName();
      this.loadAvailableSessions();
    });
  }

  loadCourseName() {
    const courseNames: { [key: number]: string } = {
      1: 'Advanced Mathematics',
      2: 'English Literature',
      3: 'Physics Fundamentals'
    };
    this.courseName = this.courseId ? courseNames[this.courseId] || '' : '';
  }

  loadAvailableSessions() {
    const today = new Date();
    
    // Define all sessions for all courses and bundles
    const allSessionsData: Session[] = [
      // Course 1 - Advanced Mathematics
      {
        id: '1',
        title: 'Advanced Mathematics',
        start: this.addDays(today, 3),
        end: this.addDaysAndHours(today, 3, 1),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        instructor: 'Ahmed Mohamed',
        availableSeats: 5,
        courseId: 1,
        bundle: 'Bundle A: Calc + Algebra'
      },
      {
        id: '2',
        title: 'Advanced Mathematics',
        start: this.addDays(today, 5),
        end: this.addDaysAndHours(today, 5, 1),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        instructor: 'Ahmed Mohamed',
        availableSeats: 3,
        courseId: 1,
        bundle: 'Bundle A: Calc + Algebra'
      },
      {
        id: '3',
        title: 'Advanced Mathematics',
        start: this.addDays(today, 7),
        end: this.addDaysAndHours(today, 7, 1),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        instructor: 'Ahmed Mohamed',
        availableSeats: 6,
        courseId: 1,
        bundle: 'Bundle B: All Math Courses'
      },
      {
        id: '4',
        title: 'Advanced Mathematics',
        start: this.addDays(today, 10),
        end: this.addDaysAndHours(today, 10, 1),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        instructor: 'Ahmed Mohamed',
        availableSeats: 4,
        courseId: 1,
        bundle: 'Bundle C: Math + Physics'
      },
      // Course 2 - English Literature
      {
        id: '5',
        title: 'English Literature',
        start: this.addDays(today, 4),
        end: this.addDaysAndHours(today, 4, 1),
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        instructor: 'Fatima Hassan',
        availableSeats: 8,
        courseId: 2,
        bundle: 'Bundle A: Lit + Writing'
      },
      {
        id: '6',
        title: 'English Literature',
        start: this.addDays(today, 6),
        end: this.addDaysAndHours(today, 6, 1),
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        instructor: 'Fatima Hassan',
        availableSeats: 2,
        courseId: 2,
        bundle: 'Bundle B: All Language Courses'
      },
      {
        id: '7',
        title: 'English Literature',
        start: this.addDays(today, 8),
        end: this.addDaysAndHours(today, 8, 1),
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        instructor: 'Fatima Hassan',
        availableSeats: 7,
        courseId: 2,
        bundle: 'Bundle A: Lit + Writing'
      },
      // Course 3 - Physics Fundamentals
      {
        id: '8',
        title: 'Physics Fundamentals',
        start: this.addDays(today, 7),
        end: this.addDaysAndHours(today, 7, 1),
        backgroundColor: '#ffc107',
        borderColor: '#e0a800',
        instructor: 'Omar Ali',
        availableSeats: 6,
        courseId: 3,
        bundle: 'Bundle A: Physics Basics'
      },
      {
        id: '9',
        title: 'Physics Fundamentals',
        start: this.addDays(today, 10),
        end: this.addDaysAndHours(today, 10, 1),
        backgroundColor: '#ffc107',
        borderColor: '#e0a800',
        instructor: 'Omar Ali',
        availableSeats: 4,
        courseId: 3,
        bundle: 'Bundle B: Physics + Math'
      },
      {
        id: '10',
        title: 'Physics Fundamentals',
        start: this.addDays(today, 12),
        end: this.addDaysAndHours(today, 12, 1),
        backgroundColor: '#ffc107',
        borderColor: '#e0a800',
        instructor: 'Omar Ali',
        availableSeats: 5,
        courseId: 3,
        bundle: 'Bundle A: Physics Basics'
      }
    ];

    this.allSessions = allSessionsData;
    this.filterAndDisplaySessions();
  }

  filterAndDisplaySessions() {
    let filteredSessions = this.allSessions;

    // Filter by course if courseId is provided
    if (this.courseId) {
      filteredSessions = filteredSessions.filter(s => s.courseId === this.courseId);
    }

    // Filter by bundle if bundle is provided
    if (this.selectedBundle) {
      filteredSessions = filteredSessions.filter(s => s.bundle === this.selectedBundle);
    }

    // Convert to FullCalendar format
    const events = filteredSessions.map(session => ({
      id: session.id,
      title: session.title,
      start: session.start,
      end: session.end,
      backgroundColor: session.backgroundColor,
      borderColor: session.borderColor,
      instructor: session.instructor,
      availableSeats: session.availableSeats,
      bundle: session.bundle
    }));

    this.calendarOptions = { ...this.calendarOptions, events };
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
    if (this.selectedSession) {
      this.bookingConfirmed = true;
      console.log('Booking confirmed:', this.selectedSession);
    }
  }

  cancelSelection() {
    this.selectedSession = null;
    this.bookingConfirmed = false;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    result.setHours(10, 0, 0, 0);
    return result;
  }

  private addDaysAndHours(date: Date, days: number, hours: number): Date {
    const result = this.addDays(date, days);
    result.setHours(result.getHours() + hours);
    return result;
  }
}
