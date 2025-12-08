# Frontend-Backend Integration Setup

## Overview
The Engify platform is now fully integrated with a complete frontend-backend architecture:
- **Frontend**: Angular 19 with standalone components
- **Backend**: NestJS with Prisma ORM and PostgreSQL database
- **Communication**: RESTful API with TypeScript type-safe services

## Architecture

### Backend Services (NestJS)
Located in `backend/src/modules/`:
- **CoursesModule**: Fetch courses with products, TAs, and sessions
- **ProductsModule**: Get products by course
- **BundlesModule**: List, get active bundles, and handle purchases
- **GroupSessionsModule**: Manage group sessions by course, join sessions
- **BookingsModule**: Create bookings, manage student/TA bookings, cancel bookings

### Frontend Services (Angular)
Located in `frontend/src/app/shared/services/`:
- **ApiService**: Base HTTP client for all API calls
- **CoursesService**: Course-related API operations
- **ProductsService**: Product-related operations
- **BundlesService**: Bundle management
- **BookingsService**: Booking operations
- **GroupSessionsService**: Group session operations

### Environment Configuration
Files:
- `frontend/src/environments/environment.ts` (Development)
- `frontend/src/environments/environment.prod.ts` (Production)

Current configuration:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Running the Application

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL running on localhost:5432
- npm or yarn

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database connection

# Run database migrations
npm run prisma:migrate

# Seed the database (optional)
npm run prisma:seed

# Start the development server
npm run start:dev

# Server will be available at http://localhost:3000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Application will be available at http://localhost:4200
```

## API Endpoints

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details with products, TAs, sessions, bundles
- `GET /api/courses/:id/support-options` - Get course support options

### Products
- `GET /api/courses/:courseId/products` - List products for a course

### Bundles
- `GET /api/bundles/list` - List all bundles
- `GET /api/bundles/active` - Get active bundles
- `POST /api/bundles/purchase` - Purchase a bundle

### Group Sessions
- `GET /api/group-sessions/course/:courseId` - Get sessions for a course
- `POST /api/group-sessions/:sessionId/join` - Join a group session

### Bookings
- `POST /api/bookings/individual` - Create a new booking
- `GET /api/bookings/student/:studentId` - Get student's bookings
- `GET /api/bookings/ta/:taId` - Get TA's bookings
- `PATCH /api/bookings/:bookingId/cancel` - Cancel a booking

## Integration Points

### 1. Courses Page
**File**: `frontend/src/app/pages/courses/courses.component.ts`

Loads courses from the backend and displays them in a grid:
```typescript
this.coursesService.getCourses().subscribe({
  next: (data) => {
    this.courses = data.map(course => ({ ... }));
  },
  error: (err) => {
    // Fallback to sample data
  }
});
```

### 2. Booking Page
**File**: `frontend/src/app/pages/booking/booking.component.ts`

Integrates with:
- **CoursesService**: Load course details
- **GroupSessionsService**: Fetch sessions for the selected course
- **BookingsService**: Create new bookings

```typescript
// Load sessions when course is selected
this.groupSessionsService.getSessionsByCourse(courseId).subscribe({
  next: (sessions) => {
    // Display in calendar
  }
});

// Create booking when user confirms
this.bookingsService.createBooking(bookingDto).subscribe({
  next: (booking) => {
    // Show confirmation
  }
});
```

### 3. Contact Form
**File**: `frontend/src/app/features/home/contact-form/contact-form.component.ts`

Submits contact form data to backend:
```typescript
this.api.post('/contact', this.form.value).subscribe({
  next: () => {
    // Show success message
  },
  error: () => {
    // Show error message
  }
});
```

## CORS Configuration

The backend is configured to accept requests from the frontend:

**File**: `backend/src/main.ts`
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
});
```

To change the allowed origin in production, set the `FRONTEND_URL` environment variable.

## Error Handling

All services include proper error handling:
- Network errors display user-friendly messages
- Failed API calls show alerts/notifications
- Fallback data or empty states handle missing data gracefully

Example:
```typescript
this.coursesService.getCourses().subscribe({
  next: (data) => { /* success */ },
  error: (err) => {
    console.error('Error:', err);
    this.error = 'Failed to load courses';
  }
});
```

## Type Safety

All API services are fully typed with TypeScript interfaces:
```typescript
export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface CourseDetails extends Course {
  products: any[];
  tas: any[];
  groupSessions: any[];
  activeBundles: any[];
}
```

## Development Tips

### 1. Adding a new API endpoint
1. Create a controller endpoint in the backend module
2. Create/update a service method in `frontend/src/app/shared/services/`
3. Call the service from your component

### 2. Testing API calls
Use the browser DevTools Network tab to inspect requests:
- Check that requests go to `http://localhost:3000/api`
- Verify response payloads match your interfaces
- Check CORS headers in response

### 3. Environment-specific configuration
Use environment files to switch API URLs:
```typescript
// In environment.ts (development)
apiUrl: 'http://localhost:3000/api'

// In environment.prod.ts (production)
apiUrl: 'https://api.engify.com/api'
```

## Troubleshooting

### CORS Error
- Ensure backend CORS is enabled
- Check `FRONTEND_URL` environment variable
- Verify frontend is running on `http://localhost:4200`

### API Not Found
- Verify backend service is running on port 3000
- Check that endpoints are defined in the corresponding module
- Ensure API path is correct (should include `/api` prefix)

### Database Connection Error
- Ensure PostgreSQL is running on localhost:5432
- Check `.env` file database credentials
- Run `npm run prisma:migrate` to ensure tables exist

## Next Steps

1. **Implement Authentication**: Add JWT auth to secure endpoints
2. **Add Error Interceptor**: Create HTTP interceptor for centralized error handling
3. **Implement Loading States**: Add skeleton loaders or spinners
4. **Add Form Validation**: Implement comprehensive form validation
5. **Create Contact Endpoint**: Add backend endpoint to handle contact form submissions
6. **User Service**: Create authentication and user management service
7. **Notification Service**: Add toast notifications for user feedback

## File Structure Summary

```
engify/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── shared/
│   │   │   │   └── services/
│   │   │   │       ├── api.service.ts
│   │   │   │       ├── courses.service.ts
│   │   │   │       ├── bookings.service.ts
│   │   │   │       ├── bundles.service.ts
│   │   │   │       ├── group-sessions.service.ts
│   │   │   │       └── products.service.ts
│   │   │   ├── pages/
│   │   │   │   ├── courses/
│   │   │   │   └── booking/
│   │   │   └── app.config.ts (includes HttpClient)
│   │   └── environments/
│   │       ├── environment.ts
│   │       └── environment.prod.ts
│   └── package.json
└── backend/
    ├── src/
    │   ├── main.ts (CORS enabled)
    │   ├── modules/
    │   │   ├── courses/
    │   │   ├── bookings/
    │   │   ├── bundles/
    │   │   ├── group-sessions/
    │   │   └── products/
    │   └── common/
    │       └── prisma/
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

## Support
For issues or questions, refer to the individual service files or check the browser console for detailed error messages.
