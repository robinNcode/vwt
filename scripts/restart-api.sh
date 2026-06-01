#!/bin/bash
# restart-api.sh — Deploy this to ~/app/ on the server.
# Called by Jenkins SSH step after uploading new binary.

APP_DIR="$HOME/app"
SCREEN_NAME="vwt"
LOG_FILE="$APP_DIR/api.log"

echo "[$(date)] Restarting VWT API..."

cd "$APP_DIR" || { echo "ERROR: $APP_DIR not found"; exit 1; }

# Kill existing screen session gracefully
if screen -list | grep -q "$SCREEN_NAME"; then
    screen -S "$SCREEN_NAME" -X quit
    sleep 2
fi

# Also kill any stray api processes
pkill -f "$APP_DIR/api" 2>/dev/null || true
sleep 1

# Ensure binary is executable
chmod +x api

# Start in a detached screen session, logging to file
screen -dmS "$SCREEN_NAME" bash -c "cd $APP_DIR && ./api >> $LOG_FILE 2>&1"

sleep 2

# Verify it started
if screen -list | grep -q "$SCREEN_NAME"; then
    echo "[$(date)] API started successfully in screen session '$SCREEN_NAME'"
    screen -ls
else
    echo "[$(date)] WARNING: screen session not found — check $LOG_FILE"
    tail -20 "$LOG_FILE" 2>/dev/null
    exit 1
fi
