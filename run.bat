@echo off
setlocal
echo -----------------------------------
echo Starting Volt Wave Tech Stack
echo -----------------------------------

:: Start Backend in a new window
echo Starting Backend (Go)...
start "VWT Backend" cmd /c "cd backend/cmd/api && go run main.go"

:: Start Frontend in a new window
echo Starting Frontend (Vite)...
start "VWT Frontend" cmd /c "cd frontend && npm run dev"

echo -----------------------------------
echo Both servers are opening in new windows.
echo -----------------------------------
pause
