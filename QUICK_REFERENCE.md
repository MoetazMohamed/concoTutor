# Quick Reference Guide

## 🚀 Start the Platform

```bash
# From engify directory
start.bat          # Windows
./start.sh         # Mac/Linux

# Or manually:
# Terminal 1:
cd backend
npm run start:dev

# Terminal 2:
cd frontend
npm start
```

## 🌐 Access Points
- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- API: http://localhost:3000/api

## 📁 Key Files

### Frontend Services
```
frontend/src/app/shared/services/
├── api.service.ts              # Base HTTP client
├── courses.service.ts          # Courses API
├── products.service.ts         # Products API
├── bookings.service.ts         # Bookings API
├── bundles.service.ts          # Bundles API
└── group-sessions.service.ts   # Sessions API
```

### Frontend Components Using Services
```
frontend/src/app/pages/
├── courses/courses.component.ts     # Uses CoursesService
├── booking/booking.component.ts     # Uses 3 services
└── home/contact-form/              # Uses ApiService
```

### Backend Modules
```
backend/src/modules/
├── courses/
│   ├── courses.controller.ts    # GET /api/courses
│   ├── courses.service.ts       # Business logic
│   └── courses.module.ts
├── products/
├── bundles/
├── group-sessions/
└── bookings/
```

### Configuration
```
Environment Files:
├── frontend/src/environments/environment.ts      # Dev
├── frontend/src/environments/environment.prod.ts # Prod
├── backend/.env                                  # Backend config
└── backend/.env.example                          # Template
```

## 🔧 Common Commands

### Backend
```bash
npm install          # Install dependencies
npm run build        # Build the project
npm run start:dev    # Start development server
npm run start:prod   # Start production server
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Seed sample data
npm run prisma:studio       # Open Prisma Studio
npm run prisma:generate     # Generate Prisma client
```

### Frontend
```bash
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production
npm test             # Run tests
ng lint              # Run linter
```

## 📝 API Endpoints Quick Reference

### Courses
```
GET  /api/courses                      # List all
GET  /api/courses/:id                  # Get by ID
GET  /api/courses/:id/support-options  # Support options
```

### Products
```
GET  /api/courses/:courseId/products   # Get products
```

### Bundles
```
GET  /api/bundles/list        # List all bundles
GET  /api/bundles/active      # Get active bundles
POST /api/bundles/purchase    # Purchase bundle
```

### Group Sessions
```
GET  /api/group-sessions/course/:courseId  # Get sessions
POST /api/group-sessions/:sessionId/join    # Join session
```

### Bookings
```
POST   /api/bookings/individual              # Create booking
GET    /api/bookings/student/:studentId      # Student's bookings
GET    /api/bookings/ta/:taId                # TA's bookings
PATCH  /api/bookings/:bookingId/cancel       # Cancel booking
```

## 💡 Using Services in Components

### Example: Load Courses
```typescript
constructor(private coursesService: CoursesService) {}

ngOnInit() {
  this.coursesService.getCourses().subscribe({
    next: (courses) => this.courses = courses,
    error: (err) => console.error(err)
  });
}
```

### Example: Create Booking
```typescript
const bookingDto = {
  studentId: 'student-1',
  courseId: 'course-1',
  productId: 'product-1',
  taId: 'ta-1',
  sessionCount: 10
};

this.bookingsService.createBooking(bookingDto).subscribe({
  next: (booking) => console.log('Created:', booking),
  error: (err) => console.error('Failed:', err)
});
```

## 🔌 Environment Configuration

### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.engify.com/api'
};
```

### Backend Configuration (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/engify
PORT=3000
FRONTEND_URL=http://localhost:4200
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# Windows: Services -> PostgreSQL
# or: psql -U postgres

# Reset Prisma
npx prisma db push
npx prisma db seed
```

### CORS Error
- Check `FRONTEND_URL` in backend/.env
- Verify CORS enabled in backend/src/main.ts
- Ensure frontend URL matches

### Module Not Found
```bash
npm install
npm run prisma:generate
```

## 📊 Project Structure Summary
```
engify/
├── frontend/           # Angular app (port 4200)
│   ├── src/app/shared/services/   # 6 HTTP services
│   ├── src/app/pages/             # Page components
│   ├── src/environments/          # Config files
│   └── package.json
├── backend/            # NestJS app (port 3000)
│   ├── src/modules/    # 5 feature modules
│   ├── prisma/         # Database schema
│   ├── .env            # Configuration
│   └── package.json
├── SETUP_COMPLETE.md           # Setup guide
├── ARCHITECTURE.md             # Architecture diagrams
├── INTEGRATION_SUMMARY.md      # What was created
├── VERIFICATION_CHECKLIST.md   # Verification checklist
└── start.bat / start.sh        # Quick start scripts
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| SETUP_COMPLETE.md | Complete setup and usage guide |
| FRONTEND_BACKEND_INTEGRATION.md | Detailed integration guide |
| INTEGRATION_SUMMARY.md | What was created |
| ARCHITECTURE.md | System architecture diagrams |
| VERIFICATION_CHECKLIST.md | Verification checklist |
| quick_reference.md | This file |

## 🔑 Key Concepts

### Services Pattern
Services encapsulate API logic for reuse across components

### Dependency Injection
Angular injects services into components via constructor

### Observables (RxJS)
HTTP calls return observables that emit data over time

### TypeScript Interfaces
Define shape of API responses for type safety

### Environment Configuration
Different configs for dev/prod environments

## ⚡ Performance Tips

1. **Use OnPush Change Detection**
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

2. **Unsubscribe from Observables**
   ```typescript
   subscription.unsubscribe();
   ```

3. **Use trackBy in ngFor**
   ```typescript
   <div *ngFor="let item of items; trackBy: trackById">
   ```

4. **Lazy Load Routes**
   ```typescript
   loadChildren: () => import('./feature/feature.module')
   ```

## 🔒 Security Notes

### Current
- ✅ CORS configured
- ✅ Input validation
- ✅ Error handling

### Add for Production
- JWT authentication
- Rate limiting
- HTTPS/TLS
- API key management
- Request logging

## 📞 Support

### If Something Breaks
1. Check error in browser console (F12)
2. Check backend logs
3. Verify .env configuration
4. Run `npm install` again
5. Check port availability
6. Review documentation files

### Debug Tips
- Use Network tab to inspect API calls
- Use Redux DevTools for state management
- Enable TypeScript strict mode
- Use console.log strategically
- Check browser console warnings

## ✅ Pre-Flight Checklist

Before running:
- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] .env file created
- [ ] Ports 3000 and 4200 available
- [ ] Dependencies installed

After starting:
- [ ] Frontend loads (localhost:4200)
- [ ] Backend runs (localhost:3000)
- [ ] Courses page shows data
- [ ] No console errors
- [ ] Network calls successful

---

**Quick Reference v1.0**
**Last Updated: December 2025**

For more details, see the complete documentation files listed above.
