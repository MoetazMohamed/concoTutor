# Quick Start - 5 Minutes

Get the Engify backend running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- PostgreSQL v12+ installed and running
- Port 3000 available

## The 5 Steps

### 1️⃣ Install Dependencies (1 min)

```bash
cd backend
npm install
```

### 2️⃣ Configure Database (1 min)

**Edit `.env` file** (already copied from `.env.example`):

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/engify_db"
NODE_ENV=development
PORT=3000
```

Create the database in PostgreSQL:

```bash
createdb -U postgres engify_db
```

### 3️⃣ Setup Database Schema (2 min)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4️⃣ (Optional) Add Sample Data (30 sec)

```bash
npm run prisma:seed
```

### 5️⃣ Start the Server (30 sec)

```bash
npm run start:dev
```

**You're done!** 🎉

The API is running at `http://localhost:3000`

## Test It

Open your browser:

```
http://localhost:3000/courses
```

You should see a JSON response.

## Next Steps

- Read [README.md](./README.md) for API documentation
- Open [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Use Postman or Thunder Client to test API endpoints
- View database with `npx prisma studio`

## Common Issues

**Can't connect to database?**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

**Port 3000 in use?**
- Change `PORT=3001` in .env

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall

Need help? See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)
