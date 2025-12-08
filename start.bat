@echo off
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo    Engify Platform - Quick Start
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js is installed: %NODE_VERSION%
echo.

REM Start Backend
echo [INFO] Starting Backend Server...
cd backend
echo [INFO] Installing backend dependencies...
call npm install
echo [INFO] Building backend...
call npm run build

REM Check PostgreSQL
echo.
echo [WARNING] Make sure PostgreSQL is running on localhost:5432
pause

REM Run migrations
echo.
echo [INFO] Running database migrations...
call npm run prisma:migrate

REM Start backend dev server in new window
echo.
echo [INFO] Starting backend development server...
start "Engify Backend" cmd /k npm run start:dev

echo [OK] Backend started on http://localhost:3000
echo.

REM Start Frontend
echo [INFO] Starting Frontend Server...
cd ..\frontend
echo [INFO] Installing frontend dependencies...
call npm install

echo [INFO] Starting frontend development server...
start "Engify Frontend" cmd /k npm start

echo [OK] Frontend started on http://localhost:4200
echo.

echo ==========================================
echo    Platform is Ready!
echo ==========================================
echo.
echo [URL] Frontend:  http://localhost:4200
echo [URL] Backend:   http://localhost:3000
echo [URL] API Docs:  http://localhost:3000/api
echo.
echo Press any key to close this window...
pause
