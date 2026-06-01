#!/bin/bash

# Startup script for VWT project
# Runs both Frontend and Backend concurrently

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    # Kill background jobs started in this shell
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "-----------------------------------"
echo "🚀 Starting Volt Wave Tech Stack"
echo "-----------------------------------"

# Start Backend
echo "📡 Starting Backend (Go)..."
(cd backend && go run cmd/api/main.go) &

# Start Frontend
echo "💻 Starting Frontend (Vite)..."
(cd frontend && npm run dev) &

echo "-----------------------------------"
echo "✅ Both servers are running!"
echo "Press Ctrl+C to stop both."
echo "-----------------------------------"

# Wait for background processes
wait
