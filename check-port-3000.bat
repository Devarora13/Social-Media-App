@echo off
echo Checking what's running on port 3000...
netstat -ano | findstr :3000
echo.
echo To kill the process, find the PID from above and run:
echo taskkill /PID [PID_NUMBER] /F
echo.
echo Or run this to kill all Node.js processes:
echo taskkill /IM node.exe /F
pause
