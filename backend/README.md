# Engify Backend

This is the backend for **Engify**, a course-based tutoring platform built with NestJS, Prisma, and PostgreSQL.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: class-validator & class-transformer
- **API Style**: REST

## Project Structure

```
backend/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── common/
│   │   └── prisma/
│   │       ├── prisma.service.ts        # Prisma database service
│   │       └── prisma.module.ts         # Prisma module
│   └── modules/
│       ├── courses/                     # Courses module
│       ├── products/                    # Products module (bundles & individual sessions)
│       ├── bundles/                     # Bundle purchases module
│       ├── group-sessions/              # Group sessions module
│       └── bookings/                    # Individual & group bookings module
├── prisma/
│   └── schema.prisma                    # Prisma database schema
├── .env                                 # Environment variables (DO NOT commit)
├── .env.example                         # Example env file
└── package.json                         # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm

### Installation

1. **Install dependencies**:

```bash
cd backend
npm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env
```

Edit `.env` and configure your PostgreSQL connection:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/engify_db"
NODE_ENV=development
PORT=3000
```

3. **Generate Prisma Client**:

```bash
npx prisma generate
```

4. **Create the database and run migrations**:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables
- Generate Prisma Client
- Create a migration file

5. **Start the development server**:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Courses

- `GET /courses` - List all courses
- `GET /courses/:id` - Get course details
- `GET /courses/:id/support-options?studentId=...` - Get course support options (products, TAs, group sessions, active bundles)

### Products

- `GET /courses/:courseId/products` - List products for a course

### Bundles

- `GET /bundles/students/:studentId` - Get all bundle purchases for a student
- `GET /bundles/students/:studentId/courses/:courseId/active` - Get active bundles for a student in a course
- `POST /bundles/courses/:courseId/purchase` - Purchase a bundle

### Group Sessions

- `GET /group-sessions/courses/:courseId` - List group sessions and bookings for a course
- `POST /group-sessions/:bookingId/join` - Join a group session

### Bookings

- `POST /bookings/individual` - Create an individual booking
- `GET /bookings/students/:studentId` - Get bookings for a student
- `GET /bookings/tas/:taId` - Get bookings for a TA
- `PATCH /bookings/:id/cancel` - Cancel a booking

## Database Schema

### Core Models

- **Student**: Represents a student user
- **Ta**: Represents a teaching assistant/tutor
- **Course**: Represents a course (e.g., COMP 248, ECSE 202)
- **Product**: Represents what we sell (individual session, bundles)
- **BundlePurchase**: Represents a student's purchase of a bundle product
- **GroupSessionTemplate**: Defines recurring group sessions (day, time, capacity)
- **Booking**: Represents a scheduled session (individual or group)
- **BookingStudent**: Join table for students attending a booking

### Enums

- **Status**: REQUESTED, BOOKED, AVAILABLE, FULL, CANCELLED
- **SessionType**: INDIVIDUAL, GROUP
- **ProductType**: INDIVIDUAL_SESSION, FULL_SEMESTER_BUNDLE, MIDTERM_FINAL_BUNDLE, GROUP_SESSION_PASS
- **BundleCoverageType**: FULL_SEMESTER, MIDTERM_FINAL_ONLY

## Development

### Watch Mode

```bash
npm run start:dev
```

### Build for Production

```bash
npm run build
npm run start:prod
```

### Database Management

**View database in Prisma Studio**:

```bash
npx prisma studio
```

**Reset database** (dangerous - removes all data):

```bash
npx prisma migrate reset
```

**Create a new migration after schema changes**:

```bash
npx prisma migrate dev --name <migration_name>
```

## Business Logic

### Bundle Purchases

- A student can purchase a bundle for a specific course
- Bundles can be "FULL_SEMESTER" or "MIDTERM_FINAL_ONLY"
- Each bundle has a validity range (validFrom/validTo) and remaining sessions
- When booking an individual session with a bundle, the remaining sessions are decremented
- If a bundle booking is cancelled, the session credit is refunded

### Individual Bookings

- Students can book 1:1 sessions with a specific TA or any available TA
- Bookings check for TA availability (no overlapping sessions)
- Bookings can be paid per session OR covered by a bundle
- Cancelling a booking refunds the bundle session if applicable

### Group Sessions

- Group sessions are defined by recurring templates (day, time, capacity)
- Students can join existing group bookings until capacity is reached
- When capacity is reached, the booking status changes to FULL

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful request
- `400 Bad Request` - Invalid input or business logic violation
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Next Steps

1. Seed the database with initial data (courses, TAs, products)
2. Integrate payment processing for bundle purchases
3. Add authentication and authorization
4. Implement email notifications for bookings
5. Add admin endpoints for managing courses, TAs, and products
6. Deploy to production environment

## Useful Commands

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migration
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (visual database browser)
npx prisma studio

# Check for TypeScript errors
npx tsc --noEmit

# Build the project
npm run build

# Start development server
npm run start:dev

# Start production server
npm run start:prod
```
