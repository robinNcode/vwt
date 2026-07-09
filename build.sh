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
if [ "$1" == "linux" ]; then
    echo "  Target: Linux (amd64)"
    GOOS=linux GOARCH=amd64 go build -o ../build/api ./cmd/api
else
    go build -o ../build/api ./cmd/api
fi
if [ $? -ne 0 ]; then
    echo "Backend build failed!"
    exit 1
fi
cp .env.production ../build/
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
