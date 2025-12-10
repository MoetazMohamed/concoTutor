# Engify - Complete Tutoring Platform

> **Full-stack tutoring platform with credit-based booking system, TA availability management, and comprehensive admin controls**

[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-brightgreen)](https://www.prisma.io/)

---

## 📋 Table of Contents
- [Quick Start](#-quick-start)
- [System Architecture](#-system-architecture)
- [Features](#-features)
- [User Types](#-user-types--features)
- [Course Management](#-course-management)
- [Credit System](#-credit-bundles-system)
- [Database Schema](#️-database-schema)
- [API Endpoints](#-api-endpoints)
- [Common Tasks](#-common-tasks)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment-checklist)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation & Setup

1. **Clone and Install**
```bash
cd engify
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. **Database Setup**
```bash
cd backend
# Create .env file with:
DATABASE_URL="postgresql://username:password@localhost:5432/engify"
JWT_SECRET="your-secret-key"
PORT=3000
FRONTEND_URL="http://localhost:4200"

# Run migrations
npx prisma migrate dev
npx prisma generate
```

3. **Start Servers**

**Option A - Using Batch File (Easiest):**
```bash
# From project root, run:
start.bat
# This automatically starts both backend and frontend in separate windows
```

**Option B - Manual Start:**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

4. **Access Application**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ENGIFY PLATFORM                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐          ┌─────────────────────────┐
│  FRONTEND (Angular)  │          │   BACKEND (NestJS)      │
│  Port: 4200          │ ←─HTTP──→│   Port: 3000            │
│                      │          │                         │
│  • Components        │          │  • Auth Module          │
│  • Services          │          │  • Students Module      │
│  • Guards            │          │  • TAs Module           │
│  • TA Dashboard      │          │  • Courses Module       │
│  • Student Dashboard │          │  • Bookings Module      │
└──────────────────────┘          │  • Admin Service        │
         │                        └──────────┬──────────────┘
         │                                   │
         └───────────────┬───────────────────┘
                         ▼
                  ┌──────────────┐
                  │ PostgreSQL   │
                  │ Database     │
                  │              │
                  │ 12 Models    │
                  └──────────────┘
```

### Tech Stack
- **Frontend:** Angular 19 (Standalone Components), TypeScript, RxJS
- **Backend:** NestJS 10, Prisma ORM, JWT Authentication
- **Database:** PostgreSQL
- **Security:** bcrypt password hashing, JWT tokens

---

## 👥 User Types & Features

### **Students**
- Register with email/password (start with 0 credits)
- Purchase credit bundles for courses
- Book sessions with TAs based on availability
- View booking history
- Manage account

### **TAs (Teaching Assistants)**
- All student features +
- Create and manage courses
- Set availability (specific dates, not recurring)
- Create/manage credit bundles
- View student bookings
- **Admin capabilities:**
  - Edit course details and prices
  - Create credit bundles with custom pricing
  - View all students or filter by course
  - Adjust student credits (add/deduct)
  - Edit student profiles
  - Cancel bookings with automatic refunds

---

## 🎓 Course Management

### Creating a Course (TA)
1. Login as TA
2. Click "**+ Create Course**"
3. Fill in:
   - Course Name (e.g., "Advanced Mathematics")
   - Course Code (e.g., "MATH301")
   - Description (optional)
   - Base Price
   - **Credit Bundles** (pre-configured or customize):
     - Basic Bundle: 5 credits @ $50
     - Standard Bundle: 10 credits @ $90
     - Premium Bundle: 20 credits @ $160
4. Add/remove bundles as needed
5. Click "**✓ Create Course with Bundles**"

### Editing a Course
1. Select course from dropdown
2. Click "**📝 Edit Course**" (admin button)
3. Update name, description, or price
4. Save changes

---

## 💰 Credit Bundles System

### How It Works
- Students start with **0 credits**
- Must purchase bundles to get credits
- Each bundle contains credits + price
- Bundles are course-specific

### Managing Bundles (TA)
1. Select a course
2. Click "**💰 Manage Bundles**"
3. **Create New Bundle:**
   - Bundle Name
   - Number of Credits
   - Price ($)
   - Description (optional)
4. View existing bundles with active/inactive status

### Bundle Types
Uses `FULL_SEMESTER_BUNDLE` product type in database

---

## 📅 Availability & Booking

### Setting Availability (TA)
1. Select course from dropdown
2. Click "**+ Add Slot**"
3. Enter:
   - **Date** (specific date, e.g., Dec 15, 2025)
   - Start Time (e.g., 09:00)
   - End Time (e.g., 10:00)
   - Capacity (number of students)
4. Submit

**Note:** Availability uses **exact dates** (not day-of-week recurring)

### Booking a Session (Student)
1. Browse available courses
2. Select course with available slots
3. Choose time slot
4. Confirm booking (credits deducted automatically)

---

## 👨‍🎓 Student Management (TA Admin)

### View Students
Click "**👨‍🎓 Manage Students**" to see:
- **Course Students:** Students enrolled in selected course
- **All Students:** Complete student list

### Adjust Credits
1. Find student in list
2. Enter credit amount:
   - Positive number (e.g., `+10`) to add
   - Negative number (e.g., `-5`) to deduct
3. Add optional reason
4. Click "**Adjust**"
5. Transaction logged automatically

### Edit Student Profile
1. Click "**Edit Info**" on student card
2. Modify name and/or email
3. Click "**Save**"

### Cancel Booking
1. Expand student's bookings
2. Click "**Cancel**" on specific booking
3. Confirm action
4. Credits automatically refunded
5. Availability slot freed

---

## 🗄️ Database Schema

### Key Models

**Student**
- email, password, name
- totalCredits (default: 0)
- usedCredits (default: 0)

**TA (Teaching Assistant)**
- email, password, name, degree, bio

**Course**
- code (unique), name, description
- price (Float, default: 0)

**TAAvailability**
- date (DateTime) - specific date
- startTime, endTime (HH:mm format)
- capacity, bookedCount

**Product (Bundles)**
- productType: FULL_SEMESTER_BUNDLE
- basePrice, name, description

**Booking**
- date, sessionType, status
- pricePerStudent (stores credits used)
- durationMinutes

**CreditTransaction**
- amount, type (ADD/DEDUCT/REFUND)
- reason, timestamp

---

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register - Register user (student/TA)
POST /api/auth/login/student - Student login
POST /api/auth/login/ta - TA login
```

### Courses
```
GET /api/courses - List all courses
POST /api/courses - Create course (TA)
PATCH /api/courses/:id - Update course (TA Admin)
GET /api/courses/:courseId/bundles - Get bundles
POST /api/courses/:courseId/bundles - Create bundle (TA Admin)
GET /api/courses/:courseId/students - Get enrolled students (TA Admin)
```

### Students
```
GET /api/students - Get all students (TA Admin)
PATCH /api/students/:studentId - Update student profile (TA Admin)
PATCH /api/students/:studentId/credits - Adjust credits (TA Admin)
DELETE /api/students/:studentId/bookings/:bookingId - Cancel booking (TA Admin)
```

### TAs
```
GET /api/tas/:taId/courses - Get assigned courses
POST /api/tas/:taId/availability - Add availability
GET /api/tas/:taId/availability - Get availability by course
DELETE /api/tas/:taId/availability/:slotId - Delete slot
```

### Bookings
```
POST /api/bookings - Create booking
GET /api/bookings/student/:studentId - Student bookings
GET /api/bookings/ta/:taId - TA bookings
```

---

## 🎨 UI Components

### TA Dashboard Sections

1. **Course Selector** - Dropdown to choose active course

2. **Tutor Actions** (Purple gradient buttons)
   - + Create Course
   - 👥 Assign Tutor
   - ➕ Create Tutor

3. **Admin Actions** (Pink gradient bar)
   - 📝 Edit Course
   - 💰 Manage Bundles
   - 👨‍🎓 Manage Students

4. **Availability Management**
   - Add/delete time slots
   - View capacity and bookings
   - Calendar displays exact dates

5. **Student Bookings**
   - View all bookings for selected course
   - Status indicators (BOOKED, CANCELLED, etc.)

### Modals
- **Edit Course Modal** - Update course details
- **Manage Bundles Modal** - Create/view bundles
- **Manage Students Modal** - Full student management

---

## 🛠️ Tech Stack

**Backend:**
- NestJS 10
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt for passwords

**Frontend:**
- Angular 19 (Standalone Components)
- TypeScript
- RxJS
- FullCalendar (for availability display)

---

## 📝 Common Tasks

### Add New Migration
```bash
cd backend
npx prisma migrate dev --name description_of_change
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

### Check for Errors
```bash
# Backend
cd backend
npm run build

# Frontend  
cd frontend
npm run build
```

### View Database
```bash
cd backend
npx prisma studio
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Run `npx prisma generate`

### Frontend compilation errors
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Angular cache: `rm -rf .angular`

### Prisma EPERM errors (Windows)
- Non-critical file lock warnings
- Close any processes using Prisma files
- Restart terminal

### Changes not showing in UI
- Hard refresh browser: `Ctrl + Shift + R`
- Clear cache: `Ctrl + F5`
- Check browser console (F12) for errors

---

## 🔐 Security Notes

- All endpoints require authentication (JWT tokens)
- Passwords hashed with bcrypt
- Credit adjustments logged for audit trail
- Booking cancellations trigger automatic refunds
- Student data modifications restricted to TAs

---

## 📊 Key Workflows

### Complete Student Journey
1. Student registers → Gets 0 credits
2. Browse courses and bundles
3. Purchase bundle → Credits added to account
4. Book available session → Credits deducted
5. Attend session or cancel (get refund)

### Complete TA Journey
1. TA registers/logs in
2. Create course with bundles
3. Set availability (specific dates)
4. Students book sessions
5. Manage students (adjust credits, cancel bookings)
6. View booking history

---

## 🎯 Important Notes

- **Credits:** Students must purchase bundles (start with 0, not 50)
- **Availability:** Uses exact dates (not recurring weekly)
- **Bundles:** Stored as `FULL_SEMESTER_BUNDLE` type
- **Booking Credits:** Stored in `pricePerStudent` field
- **API Prefix:** All endpoints use `/api` prefix
- **Ports:** Backend (3000), Frontend (4200)

---

## 📞 Quick Reference

| Action | User | Location |
|--------|------|----------|
| Create Course + Bundles | TA | Dashboard → "+ Create Course" |
| Edit Course | TA | Dashboard → "📝 Edit Course" |
| Add Bundles | TA | Dashboard → "💰 Manage Bundles" |
| Adjust Credits | TA | Dashboard → "👨‍🎓 Manage Students" |
| Set Availability | TA | Dashboard → "+ Add Slot" |
| Purchase Bundle | Student | Course Page → Select Bundle |
| Book Session | Student | Course Page → Select Time Slot |

---

## 🚦 Deployment Checklist

- [ ] Set production DATABASE_URL
- [ ] Set strong JWT_SECRET
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run build`
- [ ] Set CORS origin to production URL
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure environment variables

---

## 📂 Project Structure

```
engify/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication & Registration
│   │   │   ├── students/       # Student Management + Admin
│   │   │   ├── tas/            # TA Management + Availability
│   │   │   ├── courses/        # Course & Bundle Management
│   │   │   ├── bookings/       # Booking System
│   │   │   ├── availability/   # TA Availability Slots
│   │   │   ├── products/       # Product/Bundle Models
│   │   │   └── group-sessions/ # Group Session Templates
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database Schema
│   │   └── main.ts             # App Entry Point
│   ├── .env                    # Environment Variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── pages/
    │   │   │   ├── ta-dashboard/      # TA Admin Dashboard
    │   │   │   ├── student-dashboard/ # Student Dashboard
    │   │   │   ├── courses/           # Course Listing
    │   │   │   ├── booking/           # Booking Page
    │   │   │   └── home/              # Landing Page
    │   │   ├── services/
    │   │   │   ├── admin.service.ts   # Admin Operations
    │   │   │   ├── auth.service.ts    # Authentication
    │   │   │   └── api.service.ts     # HTTP Client
    │   │   ├── core/
    │   │   │   └── components/        # Navbar, Footer
    │   │   └── shared/
    │   │       ├── services/          # Shared Services
    │   │       └── models/            # TypeScript Interfaces
    │   └── environments/
    │       ├── environment.ts         # Dev Config
    │       └── environment.prod.ts    # Prod Config
    └── package.json
```

---

## 🧪 Testing Guide

### Manual Testing Flow

#### 1. Test Student Registration & Login
```bash
# Navigate to: http://localhost:4200/register
- Select "Student" tab
- Enter: name, email, password
- Submit
- Verify: Student starts with 0 credits
```

#### 2. Test TA Registration & Login
```bash
# Navigate to: http://localhost:4200/register
- Select "Tutor" tab
- Enter: name, email, password, degree
- Submit
- Login and access TA Dashboard
```

#### 3. Test Course Creation with Bundles
```bash
# As TA in Dashboard:
- Click "+ Create Course"
- Fill: Name, Code, Description, Price
- Configure bundles (pre-filled with 3 defaults)
- Submit
- Verify: Course and bundles created
```

#### 4. Test Availability Management
```bash
# As TA in Dashboard:
- Select course
- Click "+ Add Slot"
- Enter: Date (specific date), Start/End times, Capacity
- Submit
- Verify: Slot appears in list with capacity info
```

#### 5. Test Student Management
```bash
# As TA in Dashboard:
- Click "👨‍🎓 Manage Students"
- View all students
- Adjust credits (+10)
- Edit student profile
- Cancel a booking
- Verify: Credits adjusted, booking cancelled, refund processed
```

#### 6. Test Bundle Management
```bash
# As TA in Dashboard:
- Select course
- Click "💰 Manage Bundles"
- Create new bundle: Name, Credits, Price
- View existing bundles
- Verify: Bundle created and active
```

### API Testing with cURL

```bash
# Register Student
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123",
    "name": "Test Student",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login/student \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'

# Get Courses (with token)
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 Migration History

### Applied Migrations
1. **Initial Setup** - Core models (Student, TA, Course, Booking, etc.)
2. **20251208054247_engify** - Added authentication fields
3. **20251208065701_change_availability_to_date** - Changed to exact dates
4. **20251208071536_add_course_price_and_zero_credits** - Student credits default 0

### Running Migrations
```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply to production
npx prisma migrate deploy

# Reset database (DEV ONLY)
npx prisma migrate reset
```

---

## 🎨 UI/UX Features

### Color Scheme
- **Primary:** Purple gradient (#667eea → #764ba2)
- **Admin:** Pink gradient (#f093fb → #f5576c)
- **Success:** Green (#4caf50)
- **Error:** Red (#f44, #c33)
- **Neutral:** Gray shades

### Responsive Design
- Desktop-first approach
- Breakpoint: 768px for mobile
- Grid layouts adapt to screen size
- Touch-friendly buttons on mobile

### Animations
- Smooth modal transitions (slideUp, fadeIn)
- Hover effects on buttons
- Loading states
- Success/error message auto-dismiss (3s)

---

## 🔐 Security Implementation

### Authentication
- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Secure token generation
- **Token Storage:** LocalStorage (consider HttpOnly cookies for production)
- **Route Guards:** Protect authenticated routes

### Authorization
- **Role-based Access:** Student vs TA endpoints
- **Admin Operations:** TA-only endpoints
- **Data Isolation:** Students see only their data
- **Credit Validation:** Server-side verification

### Best Practices
- Environment variables for secrets
- CORS configuration
- Input validation (NestJS ValidationPipe)
- SQL injection prevention (Prisma parameterization)

---

## 📊 Database Optimization

### Indexes (Already Applied)
- Unique indexes: Student.email, TA.email, Course.code
- Composite unique: TAAvailability (taId, courseId, date, startTime)
- Foreign key indexes: Automatic via Prisma

### Query Optimization Tips
```typescript
// Use select to fetch only needed fields
const students = await prisma.student.findMany({
  select: { id: true, name: true, totalCredits: true }
});

// Use include for relations
const bookings = await prisma.booking.findMany({
  include: { student: true, ta: true, course: true }
});

// Pagination for large datasets
const courses = await prisma.course.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
});
```

---

## 🚨 Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `EPERM: operation not permitted` | Windows file lock on Prisma | Non-critical, ignore or restart terminal |
| `Port 3000 already in use` | Backend running | Kill process: `npx kill-port 3000` |
| `Database connection refused` | PostgreSQL not running | Start PostgreSQL service |
| `Module not found` | Missing dependencies | Run `npm install` |
| `Cannot read property of undefined` | API not running | Start backend server first |

### Backend Error Responses
```typescript
// Standard error format
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## 🌐 Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/engify"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:4200"
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 📈 Performance Considerations

### Backend
- Use connection pooling (Prisma default)
- Implement caching for frequently accessed data
- Lazy load relations only when needed
- Use database transactions for multi-step operations

### Frontend
- Lazy load routes
- Use OnPush change detection
- Unsubscribe from observables
- Implement virtual scrolling for large lists

---

## 🎯 Known Limitations & Future Enhancements

### Current Limitations
- Single timezone support
- No email notifications
- Basic search functionality
- Limited reporting/analytics

### Planned Features
- [ ] Email notifications (booking confirmations, reminders)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Multi-timezone support
- [ ] File upload for course materials
- [ ] Chat/messaging between students and TAs
- [ ] Mobile app (React Native/Flutter)
- [ ] Waiting list for full bookings
- [ ] Recurring booking patterns

---

## 📝 Contributing Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📞 Support & Contact

### Documentation
- This README (complete guide)
- Inline code comments
- API documentation (auto-generated via Swagger - TODO)

### Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [Angular Documentation](https://angular.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Last Updated:** December 10, 2025  
**Version:** 1.0.0  
**License:** MIT  
**Author:** Engify Team
