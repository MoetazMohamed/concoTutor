# Engify Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL running on localhost:5432
- Database credentials: `postgres:Tarek_100@localhost:5432/engify_db`

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Run Prisma Migration** (already done ✓)
```bash
npm run prisma:migrate
```

3. **Start Backend Server**
```bash
npm run start:dev
# Server runs on http://localhost:3000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Frontend Development Server**
```bash
ng serve
# Application runs on http://localhost:4200
```

## 🔐 Testing the System

### Test Account 1: Student
1. Navigate to http://localhost:4200/register
2. Click "Student" tab
3. Fill in:
   - Name: `Test Student`
   - Email: `student@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
   - Initial Credits: `50` (optional)
4. Click "Create Account"
5. You'll be redirected to login page

### Test Account 2: Tutor
1. Navigate to http://localhost:4200/register
2. Click "Tutor" tab
3. Fill in:
   - Name: `Test Tutor`
   - Email: `tutor@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
   - Degree: `Bachelor's in Mathematics`
4. Click "Create Account"

### Test Login
1. Navigate to http://localhost:4200/login
2. Select Student or Tutor tab
3. Use created credentials
4. Click "Login"

## 👨‍🎓 Student Workflow

1. **Login** → View Student Dashboard
2. **Dashboard**: 
   - See total, used, and available credits
   - View booking history
3. **Browse Courses**: Click "Browse Courses & Book Sessions"
4. **Select Course**: Click on a course card
5. **View Details**: See tutors, availability slots, products
6. **Book Session**: (Feature coming next)

## 👨‍🏫 Tutor Workflow

1. **Login** → View Tutor Dashboard
2. **Select Course**: Choose from assigned courses dropdown
3. **Add Availability**:
   - Click "+ Add Slot"
   - Select day of week (Sunday-Saturday)
   - Set start time (e.g., 09:00)
   - Set end time (e.g., 10:00)
   - Set capacity (e.g., 5 students)
   - Click "Add Availability"
4. **View Bookings**: See all students booked for this course
5. **Manage Slots**: Delete slots if needed

## 📊 Database Tables

### Key Tables
- **Student**: User accounts, passwords, credits
- **TA**: Tutor accounts, qualifications
- **Course**: Available courses
- **TAAvailability**: Availability slots per tutor/course
- **CreditTransaction**: Credit operation history
- **Booking**: Student bookings (when implemented)

## 🔌 API Endpoints

### Authentication
```
POST /auth/register - Create account
POST /auth/login/student - Student login
POST /auth/login/ta - Tutor login
```

### Students
```
GET /students/:id - Get profile
GET /students/:id/credits - Get credits
GET /students/:id/bookings - Get bookings
POST /students/:id/credits/add - Add credits
POST /students/:id/credits/use - Use credits
```

### Tutors
```
GET /tas/:id - Get profile
GET /tas/:id/courses - Get assigned courses
GET /tas/:id/availability - Get all availability
GET /tas/:id/courses/:courseId/bookings - Get bookings
```

### Availability
```
POST /tas/:taId/availability - Create slot
GET /tas/:taId/availability - Get all slots
GET /tas/:taId/courses/:courseId/availability - Get course slots
PATCH /tas/:taId/availability/:slotId - Update slot
DELETE /tas/:taId/availability/:slotId - Delete slot
```

### Courses
```
GET /courses - Get all courses
GET /courses/:id - Get course details
GET /courses/:id/support-options - Get pricing & options
```

## 🐛 Troubleshooting

### Backend not connecting to database
- Check PostgreSQL is running on localhost:5432
- Verify database credentials in .env
- Run `npm run prisma:db:push` to sync schema

### Frontend not loading
- Ensure `http://localhost:3000` is accessible
- Check browser console for CORS errors
- Verify Angular version: `ng version`

### Login not working
- Check browser localStorage (DevTools → Application)
- Verify token is being stored
- Check network tab for API responses

### Availability not saving
- Verify end time is after start time
- Check capacity is at least 1
- Verify course is assigned to tutor

## 📝 Important Notes

1. **Passwords**: All passwords are hashed using bcrypt
2. **Credits**: Initial credits can be set during registration
3. **Availability**: Uses 24-hour time format (HH:mm)
4. **Days**: Sunday=0, Monday=1, ... Saturday=6
5. **Soft Delete**: `isActive` flag for availability

## 🔄 Data Flow

```
Student:
Register → Login → Dashboard → Browse Courses → View TAs/Availability → Book (coming next)

Tutor:
Register → Login → Dashboard → Select Course → Add Availability → View Bookings

Admin:
View all users, courses, bookings in database
```

## ✅ Implemented Features

- ✅ Student and Tutor registration
- ✅ Separate login endpoints
- ✅ Credit system (total, used, available)
- ✅ TA availability scheduling
- ✅ Dynamic course listing
- ✅ Tutor profiles and information
- ✅ Booking history (view only)
- ✅ Navigation and authentication UI

## 🔜 Coming Next

- 🔄 Booking Integration (credit deduction)
- 🔄 Payment system
- 🔄 Email notifications
- 🔄 Reviews and ratings
- 🔄 Group sessions
- 🔄 Advanced scheduling

## 💬 Example Request

### Create Availability
```bash
curl -X POST http://localhost:3000/tas/tutor-id/availability \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "course-id",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "10:00",
    "capacity": 5
  }'
```

### Get Student Credits
```bash
curl http://localhost:3000/students/student-id/credits \
  -H "Authorization: Bearer your-token"
```

## 📞 Support

For issues or questions:
1. Check the API logs in terminal
2. Check browser console for errors
3. Verify database connections
4. Review implementation summary

---

**Happy Learning! 🎓**

**Last Updated**: December 8, 2024
**Version**: 1.0.0
