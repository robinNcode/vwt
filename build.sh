#!/bin/bash

# VWT Production Build Script (Linux/macOS)
echo "==================================="
echo "  VWT PRODUCTION BUILD SCRIPT"
echo "==================================="

# Create build dir
mkdir -p build

# Build Backend
echo "[1/2] Building Backend..."
cd backend
go build -o ../build/api ./cmd/api
if [ $? -ne 0 ]; then
    echo "Backend build failed!"
    exit 1
fi
cp .env.production ../build/.env
cd ..

# Build Frontend
echo "[2/2] Building Frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed!"
    exit 1
fi
cd ..

echo "==================================="
echo "Build complete!"
echo "Assets are in:"
echo "- Backend: ./build/api"
echo "- Frontend: ./frontend/dist"
echo "==================================="
