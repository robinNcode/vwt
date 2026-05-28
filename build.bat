@echo off
setlocal
echo ===================================
echo   VWT PRODUCTION BUILD SCRIPT
echo ===================================

:: Build Backend
echo [1/2] Building Backend...
cd backend
go build -o ../build/api.exe ./cmd/api
if %errorlevel% neq 0 (
    echo Backend build failed!
    exit /b %errorlevel%
)
copy .env.production ..\backend\build\.env
cd ..

:: Build Frontend
echo [2/2] Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b %errorlevel%
)
cd ..

echo ===================================
echo Build complete! 
echo Assets are in: 
echo - Backend: ./build/api.exe
echo - Frontend: ./frontend/dist
echo ===================================
pause
