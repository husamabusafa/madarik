@echo off
echo 🚀 Starting Madarik Real Estate Platform...

echo 📡 Starting NestJS server...
start "Madarik Server" cmd /k "cd server && npm run start:dev"

timeout /t 3 /nobreak >nul

echo ⚛️  Starting React client...
start "Madarik Client" cmd /k "cd client && npm run dev"

echo.
echo ✅ Both servers are starting:
echo    🖥️  Client: http://localhost:5100
echo    🔧 Server: http://localhost:3100
echo    📊 API Health: http://localhost:3100/api/v1/health
echo.
echo Close the terminal windows to stop the servers
pause
