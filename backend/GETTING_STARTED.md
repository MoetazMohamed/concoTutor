# 🚀 Getting Started with Engify Backend

Welcome! This is your entry point to the Engify backend.

## ⚡ 5-Minute Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env: change DATABASE_URL to your PostgreSQL connection

# 3. Create database
npx prisma migrate dev --name init

# 4. Start development server
npm run start:dev
```

**Done!** Your API is running at `http://localhost:3000`

## 📚 Full Documentation

Start here:
- **[INDEX.md](./INDEX.md)** - Documentation index & navigation guide
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick start
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[README.md](./README.md)** - API documentation

## 📡 Test the API

```bash
# List all courses
curl http://localhost:3000/courses

# Using a REST client like Postman or Thunder Client
# GET http://localhost:3000/courses
```

## 🛠️ Common Commands

```bash
npm run start:dev           # Development with hot-reload
npm run build               # Build for production
npx prisma studio          # Visual database browser
npm run prisma:seed         # Add sample data
npm run start:prod          # Production server
```

## 🤔 Need Help?

- **Setup issues?** → Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **API questions?** → Check [README.md](./README.md)
- **Want overview?** → Start with [INDEX.md](./INDEX.md)
- **Architecture?** → Study [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/          # 5 NestJS modules
│   ├── common/           # Shared services (Prisma)
│   ├── app.module.ts     # Main app module
│   └── main.ts           # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
├── dist/                 # Compiled code (generated)
├── .env                  # Environment (edit this!)
└── package.json          # Dependencies
```

## ✅ What's Included

- ✅ 5 NestJS modules (Courses, Products, Bundles, GroupSessions, Bookings)
- ✅ 15+ REST API endpoints
- ✅ 9 database models with relationships
- ✅ Complete validation & error handling
- ✅ Production-ready code
- ✅ Comprehensive documentation

## 🎯 Key Features

- **Bundle Management** - Purchase, track sessions, refund credits
- **Individual Bookings** - Book with specific TA or any available
- **Group Sessions** - Join with capacity management
- **Validation** - Full DTO validation with decorators
- **Error Handling** - Meaningful error messages
- **Type Safety** - Complete TypeScript implementation

## 📖 Next Steps

1. **Get it running**: Follow the 5-Minute Start above
2. **Understand the API**: Read [README.md](./README.md)
3. **Learn the architecture**: Check [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
4. **Explore the code**: Look in `src/modules/`
5. **Start building**: Add your features!

---

**Questions?** → See [INDEX.md](./INDEX.md) for full documentation index

**Ready?** → `npm install` and enjoy! 🎉
