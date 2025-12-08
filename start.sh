#!/bin/bash
# Quick Start Script for Engify Platform

echo "=========================================="
echo "   Engify Platform - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Start Backend
echo "📦 Starting Backend Server..."
cd backend || exit
npm install
npm run build

# Check if PostgreSQL is running
echo ""
echo "⚠️  Make sure PostgreSQL is running on localhost:5432"
read -p "Press Enter to continue..."

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Start backend dev server
echo ""
echo "🚀 Starting backend development server..."
npm run start:dev &
BACKEND_PID=$!

echo "✅ Backend started on http://localhost:3000"
echo ""

# Start Frontend
echo "📱 Starting Frontend Server..."
cd ../frontend || exit
npm install

echo "🚀 Starting frontend development server..."
npm start &
FRONTEND_PID=$!

echo "✅ Frontend started on http://localhost:4200"
echo ""

echo "=========================================="
echo "   Platform is Ready!"
echo "=========================================="
echo ""
echo "📍 Frontend:  http://localhost:4200"
echo "📍 Backend:   http://localhost:3000"
echo "📍 API Docs:  http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
