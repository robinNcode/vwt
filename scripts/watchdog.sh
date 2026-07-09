#!/bin/bash
# watchdog.sh — Add this to crontab as a safety net.
# Cron: */5 * * * * bash ~/app/watchdog.sh >> ~/app/watchdog.log 2>&1

APP_DIR="$HOME/app"
SCREEN_NAME="vwt"

if ! screen -list | grep -q "$SCREEN_NAME"; then
    echo "[$(date)] API not running — restarting..."
    cd "$APP_DIR" && chmod +x api
    screen -dmS "$SCREEN_NAME" bash -c "cd $APP_DIR && GOMAXPROCS=1 GOGC=50 DB_AUTO_MIGRATE=true ./api >> $APP_DIR/api.log 2>&1"
    echo "[$(date)] Restarted."
fi
