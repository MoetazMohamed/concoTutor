import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';

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

  ngOnInit() {
    this.loadAvailableSessions();
  }

  loadAvailableSessions() {
    // Generate sessions for the next few weeks
    const today = new Date();
    const events = [
      {
        id: '1',
        title: 'Advanced Mathematics',
        start: this.addDays(today, 3) + 'T10:00:00',
        end: this.addDays(today, 3) + 'T11:00:00',
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        instructor: 'Ahmed Mohamed',
        availableSeats: 5
      },
      {
        id: '2',
        title: 'Advanced Mathematics',
        start: this.addDays(today, 5) + 'T14:00:00',
        end: this.addDays(today, 5) + 'T15:00:00',
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        instructor: 'Ahmed Mohamed',
        availableSeats: 3
      },
      {
        id: '3',
        title: 'English Literature',
        start: this.addDays(today, 4) + 'T10:00:00',
        end: this.addDays(today, 4) + 'T11:00:00',
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        instructor: 'Fatima Hassan',
        availableSeats: 8
      },
      {
        id: '4',
        title: 'English Literature',
        start: this.addDays(today, 6) + 'T16:00:00',
        end: this.addDays(today, 6) + 'T17:00:00',
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        instructor: 'Fatima Hassan',
        availableSeats: 2
      },
      {
        id: '5',
        title: 'Physics Fundamentals',
        start: this.addDays(today, 7) + 'T09:00:00',
        end: this.addDays(today, 7) + 'T10:00:00',
        backgroundColor: '#ffc107',
        borderColor: '#e0a800',
        instructor: 'Omar Ali',
        availableSeats: 6
      },
      {
        id: '6',
        title: 'Physics Fundamentals',
        start: this.addDays(today, 10) + 'T15:00:00',
        end: this.addDays(today, 10) + 'T16:00:00',
        backgroundColor: '#ffc107',
        borderColor: '#e0a800',
        instructor: 'Omar Ali',
        availableSeats: 4
      }
    ];
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
      availableSeats: event.extendedProps['availableSeats']
    };
    this.bookingConfirmed = false;
  }

  confirmBooking() {
    if (this.selectedSession) {
      this.bookingConfirmed = true;
      // Here you would typically call a service to save the booking
      console.log('Booking confirmed:', this.selectedSession);
    }
  }

  cancelSelection() {
    this.selectedSession = null;
    this.bookingConfirmed = false;
  }

  private addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }
}
