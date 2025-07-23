@echo off
echo Starting Social Media App Backend...
echo.
cd "C:\Users\Dev\OneDrive\Desktop\Social Media App\backend"
echo Current directory: %cd%
echo.
echo Installing dependencies (if needed)...
npm install
echo.
echo Starting server...
npm run start:dev
