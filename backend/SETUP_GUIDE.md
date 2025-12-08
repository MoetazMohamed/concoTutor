# Engify Backend - Setup Guide

Complete setup instructions for the Engify backend project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - comes with Node.js
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

Verify installation:

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
psql --version    # Should be PostgreSQL 12+
```

## Step 1: Clone & Navigate to Backend

```bash
cd engify
cd backend
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `@nestjs/*` - NestJS framework
- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI tools
- `class-validator` - DTO validation
- `class-transformer` - Object transformation
- And development dependencies

## Step 3: Configure Environment

1. **Copy the example environment file**:

```bash
cp .env.example .env
```

2. **Edit `.env` file with your PostgreSQL credentials**:

```env
# .env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/engify_db"
NODE_ENV=development
PORT=3000
```

Replace:
- `your_password` with your PostgreSQL password
- `postgres` with your PostgreSQL username (if different)
- `localhost` with your database host (if different)
- `engify_db` with desired database name (optional)

**Important**: The `.env` file contains secrets and should never be committed to git.

## Step 4: Create PostgreSQL Database

Open PostgreSQL client (psql or pgAdmin) and create the database:

```sql
CREATE DATABASE engify_db;
```

Or use the command line:

```bash
createdb -U postgres engify_db
```

## Step 5: Generate Prisma Client

Generate the Prisma client based on your schema:

```bash
npx prisma generate
```

You should see:
```
✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client
```

## Step 6: Run Database Migrations

Create the database tables by running the initial migration:

```bash
npx prisma migrate dev --name init
```

During this process, Prisma will:
1. Create all necessary database tables
2. Create the `prisma/migrations` folder
3. Generate the migration file

You should see output like:
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite at "./dev.db"

✔ Your database is now in sync with your Prisma schema.
✔ Run prisma studio if you want to browse your data.
```

## Step 7: (Optional) Seed the Database

Add sample data for testing and development:

```bash
npm run prisma:seed
```

This will create:
- 3 TAs (teaching assistants)
- 3 courses
- Various products (bundles, individual sessions)
- 3 student users
- Group session templates
- Sample bookings

## Step 8: Start the Development Server

```bash
npm run start:dev
```

You should see:
```
[Nest] ...   - 12/07/2024, ... PM     LOG [NestFactory] Starting Nest application...
[Nest] ...   - 12/07/2024, ... PM     LOG [InstanceLoader] PrismaModule dependencies initialized ...
[Nest] ...   - 12/07/2024, ... PM     LOG [InstanceLoader] CoursesModule dependencies initialized ...
...
Application running on port 3000
```

## Step 9: Verify Installation

Test the API with a simple request:

```bash
# In a new terminal
curl http://localhost:3000/courses

# Or use your browser:
# http://localhost:3000/courses
```

You should see a JSON response with course data (empty array if no data added).

## Troubleshooting

### Issue: "Cannot find database"

**Solution**: Ensure PostgreSQL is running and your `DATABASE_URL` in `.env` is correct.

```bash
# Verify PostgreSQL is running
# Windows: Check Services or Task Manager
# Mac: brew services list
# Linux: systemctl status postgresql

# Test connection
psql -U postgres -h localhost
```

### Issue: "Port 3000 already in use"

**Solution**: Change the PORT in `.env` file:

```env
PORT=3001
```

Then start again: `npm run start:dev`

### Issue: "Prisma Client is not generated"

**Solution**: Generate it manually:

```bash
npx prisma generate
```

### Issue: Migration fails

**Solution**: Reset the database (removes all data):

```bash
npx prisma migrate reset
```

Then try `npm run prisma:migrate` again.

### Issue: TypeScript compilation errors

**Solution**: Ensure node_modules is properly installed:

```bash
rm -r node_modules package-lock.json
npm install
```

## Next Steps After Setup

### 1. Explore the Database

Open Prisma Studio to browse and manage data:

```bash
npx prisma studio
```

This opens an interactive web interface at `http://localhost:5555`

### 2. Test API Endpoints

Use tools like:
- **Postman** - [Download](https://www.postman.com/downloads/)
- **VS Code REST Client Extension**
- **Thunder Client** - VS Code extension
- **curl** - Command line

Example API calls:

```bash
# List all courses
curl http://localhost:3000/courses

# Get course details with support options
curl http://localhost:3000/courses/COURSE_ID/support-options?studentId=STUDENT_ID

# List products for a course
curl http://localhost:3000/courses/COURSE_ID/products

# Create a booking
curl -X POST http://localhost:3000/bookings/individual \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_ID",
    "courseId": "COURSE_ID",
    "date": "2024-12-15T15:00:00Z",
    "durationMinutes": 60
  }'
```

### 3. Configure IDE

Add to VS Code `settings.json` for better TypeScript support:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

### 4. Install Useful Extensions

For VS Code:
- **Prisma** - Syntax highlighting for schema.prisma
- **Thunder Client** - REST API client
- **REST Client** - Send HTTP requests
- **Error Lens** - Show errors inline

## Useful Commands Reference

```bash
# Development
npm run start:dev        # Start dev server with watch mode
npm run build            # Build for production
npm run start:prod       # Start production server

# Database
npx prisma migrate dev   # Create and run migration
npx prisma migrate reset # Reset database (deletes all data)
npx prisma studio       # Open database GUI

# Utilities
npx prisma generate     # Generate Prisma Client
npm run prisma:seed     # Seed database with sample data
npx tsc --noEmit        # Check TypeScript compilation

# Cleaning
rm -r node_modules dist  # Remove build artifacts
npm install              # Reinstall dependencies
```

## Project Structure

```
backend/
├── src/
│   ├── main.ts                     # Application entry point
│   ├── app.module.ts               # Root module
│   ├── common/
│   │   └── prisma/
│   │       ├── prisma.service.ts   # Database service
│   │       └── prisma.module.ts    # Database module
│   └── modules/
│       ├── courses/                # Course endpoints
│       ├── products/               # Product endpoints
│       ├── bundles/                # Bundle purchase endpoints
│       ├── group-sessions/         # Group session endpoints
│       └── bookings/               # Booking endpoints
├── prisma/
│   ├── schema.prisma               # Database schema definition
│   ├── seed.ts                     # Sample data seeder
│   └── migrations/                 # Migration history
├── dist/                           # Compiled JavaScript (generated)
├── node_modules/                   # Dependencies (generated)
├── .env                            # Environment variables (not committed)
├── .env.example                    # Example environment file
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Getting Help

- Check the [Engify README](./README.md) for API documentation
- Review NestJS docs: https://docs.nestjs.com
- Prisma docs: https://www.prisma.io/docs
- Check existing error messages and stack traces

## Production Deployment

Before deploying:

1. **Set NODE_ENV to production**:
```env
NODE_ENV=production
```

2. **Use a production database** (not localhost)

3. **Build the project**:
```bash
npm run build
```

4. **Deploy migrations**:
```bash
npx prisma migrate deploy
```

5. **Start the server**:
```bash
npm run start:prod
```

6. **Use a production process manager** (PM2, systemd, Docker, etc.)

Happy coding! 🚀
