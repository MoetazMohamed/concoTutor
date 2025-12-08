# Engify Platform - Complete Setup Guide

## 🎯 Overview

Engify is a full-stack tutoring platform with:
- **Frontend**: Angular 19 standalone components
- **Backend**: NestJS with Prisma ORM and PostgreSQL
- **Database**: PostgreSQL with 9 models and relationships
- **API**: RESTful API with full CORS support

## ✅ What's Ready

### ✓ Complete Backend (NestJS)
- 5 modules: Courses, Products, Bundles, GroupSessions, Bookings
- 15+ REST endpoints fully implemented
- Database schema with Prisma migrations
- CORS configured for frontend communication
- Error handling and validation

### ✓ Complete Frontend (Angular)
- 6 HTTP services for API communication
- Environment configuration (dev/prod)
- Integrated pages: Courses, Booking, Contact Form
- Type-safe TypeScript interfaces
- Error handling with fallback data

### ✓ Database
- 9 models with relationships
- 4 enums (Status, SessionType, ProductType, BundleCoverageType)
- Seed file ready to populate sample data

## 🚀 Quick Start (Windows)

### 1. Prerequisites
```bash
# Check Node.js installation
node --version  # Should be v18 or higher

# Install PostgreSQL (if not already installed)
# https://www.postgresql.org/download/windows/
```

### 2. Start the Platform
**Option A: Using the start script (easiest)**
```bash
# In the engify directory
start.bat
```

This will:
- Install all dependencies
- Build the backend
- Run database migrations
- Start backend on http://localhost:3000
- Start frontend on http://localhost:4200

**Option B: Manual setup**

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your PostgreSQL credentials (if needed)
# Default: localhost:5432

# Run database migrations
npm run prisma:migrate

# (Optional) Seed sample data
npm run prisma:seed

# Start development server
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Opens at http://localhost:4200
```

## 📱 Using the Application

### Accessing Pages
- **Courses**: http://localhost:4200/courses
- **Booking**: http://localhost:4200/booking
- **Home**: http://localhost:4200/

### Backend Endpoints

#### Courses API
```
GET  /api/courses                  - List all courses
GET  /api/courses/:id              - Get course with details
GET  /api/courses/:id/support-options - Get support options
```

#### Products API
```
GET  /api/courses/:courseId/products - List products for course
```

#### Bundles API
```
GET  /api/bundles/list             - List all bundles
GET  /api/bundles/active           - Get active bundles
POST /api/bundles/purchase         - Purchase bundle
```

#### Group Sessions API
```
GET  /api/group-sessions/course/:courseId - Sessions for course
POST /api/group-sessions/:sessionId/join   - Join a session
```

#### Bookings API
```
POST   /api/bookings/individual           - Create booking
GET    /api/bookings/student/:studentId   - Student's bookings
GET    /api/bookings/ta/:taId             - TA's bookings
PATCH  /api/bookings/:bookingId/cancel    - Cancel booking
```

## 📁 Project Structure

```
engify/
├── frontend/                    # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── shared/
│   │   │   │   └── services/   # API services
│   │   │   │       ├── api.service.ts
│   │   │   │       ├── courses.service.ts
│   │   │   │       ├── bookings.service.ts
│   │   │   │       ├── bundles.service.ts
│   │   │   │       ├── group-sessions.service.ts
│   │   │   │       └── products.service.ts
│   │   │   ├── pages/          # Page components
│   │   │   ├── features/       # Feature components
│   │   │   └── core/           # Core components (navbar, footer)
│   │   ├── environments/       # Configuration
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   └── index.html
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── app.module.ts       # Root module
│   │   ├── main.ts             # Entry point (CORS enabled)
│   │   ├── modules/            # Feature modules
│   │   │   ├── courses/
│   │   │   ├── bookings/
│   │   │   ├── bundles/
│   │   │   ├── group-sessions/
│   │   │   └── products/
│   │   └── common/
│   │       └── prisma/         # Database service
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Sample data
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── FRONTEND_BACKEND_INTEGRATION.md  # Integration guide
├── start.bat                        # Windows quick start
├── start.sh                         # Unix quick start
└── package.json                     # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/engify"
PORT=3000
FRONTEND_URL=http://localhost:4200
```

#### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🐛 Troubleshooting

### Backend Issues

**Port 3000 already in use**
```bash
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database connection error**
```bash
# Check PostgreSQL is running
# Windows: Services -> PostgreSQL
# Or: psql -U postgres

# Check .env credentials
# Default user: postgres
# Default password: (empty or what you set during install)
```

**Migration failed**
```bash
# Reset database
npm run prisma:reset

# Re-run migration
npm run prisma:migrate
```

### Frontend Issues

**Port 4200 already in use**
```bash
# In frontend directory
ng serve --port 4201
```

**CORS error when calling API**
- Ensure backend is running on port 3000
- Check CORS is enabled in backend/src/main.ts
- Verify frontend URL in FRONTEND_URL env var

**Blank courses page**
- Open DevTools (F12) -> Network tab
- Check if API requests succeed
- Look for 404 or CORS errors

## 📚 API Testing

### Using cURL
```bash
# Get all courses
curl http://localhost:3000/api/courses

# Get course details
curl http://localhost:3000/api/courses/1

# Create booking
curl -X POST http://localhost:3000/api/bookings/individual \
  -H "Content-Type: application/json" \
  -d '{"studentId":"1","courseId":"1","productId":"1","taId":"1","sessionCount":5}'
```

### Using Postman
1. Import backend API collection
2. Set environment variable: `baseUrl = http://localhost:3000/api`
3. Make requests to endpoints

## 🎓 Service Examples

### Loading Courses
```typescript
// In component
constructor(private coursesService: CoursesService) {}

ngOnInit() {
  this.coursesService.getCourses().subscribe({
    next: (courses) => {
      this.courses = courses;
    },
    error: (err) => {
      console.error('Error loading courses:', err);
    }
  });
}
```

### Creating a Booking
```typescript
const bookingDto = {
  studentId: 'student-123',
  courseId: 'course-456',
  productId: 'product-789',
  taId: 'ta-012',
  sessionCount: 10
};

this.bookingsService.createBooking(bookingDto).subscribe({
  next: (booking) => {
    console.log('Booking created:', booking);
  },
  error: (err) => {
    console.error('Booking failed:', err);
  }
});
```

## 🔐 Security Notes

Current implementation includes:
- ✓ CORS configuration for same-origin requests
- ✓ Input validation with DTOs
- ✓ Error handling

Recommended for production:
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] HTTPS/TLS
- [ ] Environment-based configuration
- [ ] Database connection pooling
- [ ] Request logging and monitoring

## 📖 Next Steps

1. **Add Authentication**
   - Implement JWT login
   - Add auth guards to routes
   - Secure API endpoints

2. **Implement Contact Endpoint**
   - Add POST /api/contact endpoint
   - Integrate email service

3. **Add More Features**
   - Student profiles
   - Payment integration
   - Notifications
   - Reviews and ratings

4. **Deployment**
   - Deploy backend to cloud (AWS, Heroku, DigitalOcean)
   - Deploy frontend to CDN (Vercel, Netlify, Firebase)
   - Set up CI/CD pipeline

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Review browser console (F12)
3. Check backend logs
4. Verify API endpoints with Postman
5. Check .env configuration

## 📄 Documentation Files

- `FRONTEND_BACKEND_INTEGRATION.md` - Detailed integration guide
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

---

**Happy coding! 🚀**

Last updated: December 2025
