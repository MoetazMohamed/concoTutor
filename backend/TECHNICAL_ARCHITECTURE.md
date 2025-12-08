# Engify Backend - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REST API Layer (NestJS)                   │
│  Controllers handle HTTP requests and route to services      │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Business Logic Layer (Services)               │
│  Services contain core business logic and validation         │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer (Prisma)                │
│  Prisma ORM provides type-safe database access              │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                             │
│  9 tables with relationships managed via Prisma             │
└─────────────────────────────────────────────────────────────┘
```

## Module Architecture

```
AppModule
├── PrismaModule
│   ├── PrismaService (singleton for DB access)
│   └── Exported for all modules
│
├── CoursesModule
│   ├── CoursesController
│   ├── CoursesService
│   └── DTOs (CourseDto, CourseSupportOptionsDto)
│
├── ProductsModule
│   ├── ProductsController
│   ├── ProductsService
│   └── DTOs (ProductDto)
│
├── BundlesModule
│   ├── BundlesController
│   ├── BundlesService
│   └── DTOs (CreateBundlePurchaseDto, BundlePurchaseDto)
│
├── GroupSessionsModule
│   ├── GroupSessionsController
│   ├── GroupSessionsService
│   └── DTOs (JoinGroupSessionDto, GroupSessionBookingDto)
│
└── BookingsModule
    ├── BookingsController
    ├── BookingsService
    └── DTOs (CreateIndividualBookingDto, BookingDto, CancelBookingDto)
```

## Data Flow Examples

### Creating an Individual Booking

```
1. POST /bookings/individual
   ↓
2. BookingsController.createIndividualBooking()
   ↓
3. BookingsService.createIndividualBooking()
   ├─ Validate student exists
   ├─ Validate course exists
   ├─ Validate/select TA
   ├─ Check TA availability (no overlapping bookings)
   ├─ Handle bundle vs pay-per-session
   │  ├─ If bundle: Validate bundle, decrement sessions
   │  └─ If pay-per-session: Fetch price from product
   ├─ Create Booking in database
   ├─ Create BookingStudent relationship
   └─ Return booking
   ↓
4. HTTP 200 Response with booking details
```

### Joining a Group Session

```
1. POST /group-sessions/:bookingId/join
   ↓
2. GroupSessionsController.joinGroupSession()
   ↓
3. GroupSessionsService.joinGroupSession()
   ├─ Validate student exists
   ├─ Get booking with template
   ├─ Validate is GROUP session type
   ├─ Check capacity (current < template.capacity)
   ├─ Prevent duplicate joins
   ├─ Create BookingStudent
   ├─ If at capacity: Update status to FULL
   └─ Return success
   ↓
4. HTTP 200 Response
```

### Purchasing a Bundle

```
1. POST /bundles/courses/:courseId/purchase
   ↓
2. BundlesController.purchaseBundle()
   ↓
3. BundlesService.purchaseBundle()
   ├─ Validate student exists
   ├─ Validate course exists
   ├─ Validate product exists for course
   ├─ Prevent duplicate purchase
   ├─ Create BundlePurchase
   │  └─ remainingSessions = totalSessions
   │  └─ validFrom, validTo set
   └─ Return bundle purchase
   ↓
4. HTTP 200 Response with bundle details
```

## Database Relationships

```
Student
├─ bookings (via BookingStudent)
└─ bundlePurchases

Ta
├─ bookings
├─ groupSessionTemplates
└─ courses (via CourseTA)

Course
├─ tas (via CourseTA)
├─ products
├─ bookings
├─ groupSessionTemplates
└─ bundlePurchases

Product
└─ bundlePurchases

BundlePurchase
├─ student
├─ course
├─ product
└─ bookings

GroupSessionTemplate
├─ course
├─ ta
└─ bookings

Booking
├─ course
├─ ta
├─ students (via BookingStudent)
├─ groupSessionTemplate (if group)
└─ bundlePurchase (if using bundle)
```

## Validation Flow

### At DTO Level (class-validator)
- Decorators automatically validate input
- Runs before controller methods
- Returns 400 Bad Request if invalid
- Examples: @IsString(), @IsDateString(), @IsEnum()

### At Service Level (Business Logic)
- Resource existence checks (NotFoundException)
- Relationship validation (TA teaches course)
- State validation (bundle still valid)
- Conflict detection (overlapping bookings)
- Capacity checks (group session full)

### Combined Validation Chain
```
HTTP Request
  ↓
ValidationPipe (class-validator)
  └─ Validates against DTO decorators
  ↓
Controller
  └─ Receives validated DTO
  ↓
Service
  ├─ Verify resources exist
  ├─ Check business rules
  ├─ Validate state
  └─ Update database
  ↓
HTTP Response or Error
```

## Error Handling Strategy

```
Controller Method
  ├─ Catch validation errors (ValidationPipe)
  │  └─ 400 Bad Request
  │
  └─ Try/Catch around service call
     ├─ NotFoundException
     │  └─ 404 Not Found
     │
     ├─ BadRequestException
     │  └─ 400 Bad Request
     │
     └─ Unexpected errors
        └─ 500 Internal Server Error
```

## Authentication Considerations (Future)

Current implementation has no authentication. For production:

```
1. Add JWT or OAuth2 authentication
2. Add AuthGuard to protected routes
3. Extract userId from request context
4. Validate user has permission to resource

Example protected controller:
@Controller('bookings')
export class BookingsController {
  @Post('individual')
  @UseGuards(AuthGuard('jwt'))
  async createBooking(@Request() req) {
    // req.user contains authenticated user
  }
}
```

## Performance Considerations

### Current Optimizations
- [x] Indexed database IDs (primary keys)
- [x] Unique constraints prevent duplicates
- [x] Efficient relationship loading with Prisma includes
- [x] Async/await for non-blocking I/O

### Future Optimizations
- [ ] Add database indexes on frequently queried fields
- [ ] Implement caching (Redis) for course/product lists
- [ ] Pagination for large result sets
- [ ] Query optimization with select()
- [ ] Database connection pooling

### Scalability Considerations
- [x] Modular structure supports microservices refactor
- [x] Each module can be scaled independently
- [x] Database transactions for critical operations
- [x] Error handling prevents cascading failures

## Deployment Architecture

```
Development Environment
├─ npm run start:dev
├─ Watch mode for file changes
└─ Local PostgreSQL database

Production Environment
├─ npm run build → TypeScript compiled to dist/
├─ npm run prisma:migrate:deploy
├─ npm run start:prod
├─ Environment from .env (via process.env)
└─ Production PostgreSQL database
```

### Production Checklist
- [ ] Set NODE_ENV=production in .env
- [ ] Use production database connection
- [ ] Enable request logging
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable CORS for frontend domain
- [ ] Add rate limiting
- [ ] Use HTTPS
- [ ] Add API documentation (Swagger)
- [ ] Set up monitoring and alerting
- [ ] Configure backups

## Technology Stack Details

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | NestJS | 10.2.10 | Web framework |
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Language** | TypeScript | 5.3.3 | Type safety |
| **ORM** | Prisma | 5.6.0 | Database access |
| **Database** | PostgreSQL | 12+ | Data storage |
| **Validation** | class-validator | 0.14.0 | DTO validation |
| **Transform** | class-transformer | 0.5.1 | Object mapping |
| **Async** | RxJS | 7.8.1 | Reactive programming |
| **Decorators** | reflect-metadata | 0.1.13 | Decorator support |

## API Response Format

All endpoints return JSON with consistent structure:

### Success Response
```json
{
  "id": "cuid123",
  "courseId": "cuid456",
  "taId": "cuid789",
  "status": "BOOKED",
  "sessionType": "INDIVIDUAL",
  "date": "2024-12-15T15:00:00Z",
  "durationMinutes": 60,
  "pricePerStudent": 40,
  ...
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "This TA does not teach this course",
  "error": "Bad Request"
}
```

## Development Workflow

```
1. Update schema.prisma
   ↓
2. npx prisma migrate dev --name description
   (Creates migration and updates database)
   ↓
3. Code business logic in services
   ↓
4. Create DTOs with validation
   ↓
5. Wire up controllers
   ↓
6. npm run start:dev (auto-reloads)
   ↓
7. Test with curl/Postman
   ↓
8. Repeat
```

## Testing Strategy (Future)

Recommended testing approach:

```
Unit Tests
├─ Service tests (business logic)
└─ DTO validation tests

Integration Tests
├─ Controller tests (with mocked services)
└─ Database tests (with test database)

E2E Tests
└─ Full API flow tests

Example test file structure:
src/modules/bookings/bookings.service.spec.ts
src/modules/bookings/bookings.controller.spec.ts
test/bookings.e2e.spec.ts
```

## Security Best Practices (Future)

- [ ] Input validation (already have DTOs)
- [ ] SQL injection prevention (Prisma handles this)
- [ ] CORS configuration
- [ ] Rate limiting on API endpoints
- [ ] Request size limits
- [ ] Helmet.js for security headers
- [ ] Audit logging for sensitive operations
- [ ] Data encryption for sensitive fields
- [ ] Regular security updates
- [ ] Penetration testing before deployment

This architecture provides a solid foundation for a scalable, maintainable backend system!
