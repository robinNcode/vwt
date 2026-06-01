#!/bin/bash

# VWT Deployment Script
# This script handles uploading built assets to the shared hosting via FTP
# and restarting the backend via SSH.

# Configuration
FTP_HOST="voltwavebd.com"
FTP_USER="deploy@voltwavebd.com"
FTP_PASS="PifqCVU)uq9E@z90"
FRONTEND_DIR="public_html/"
BACKEND_DIR="app/"

echo "==================================="
echo "  VWT DEPLOYMENT SCRIPT"
echo "==================================="

# 1. Deploy Frontend
echo "[1/2] Deploying Frontend..."
if [ -d "frontend/dist" ]; then
    cd frontend/dist
    if command -v lftp >/dev/null 2>&1; then
        lftp -c "set ftp:ssl-allow no; open -u $FTP_USER,$FTP_PASS $FTP_HOST; mirror -R . $FRONTEND_DIR"
    else
        echo "Error: lftp is required for recursive FTP upload."
        exit 1
    fi
    cd ../..
else
    echo "Error: frontend/dist not found. Did you build it?"
    exit 1
fi

# 2. Deploy Backend
echo "[2/2] Deploying Backend..."
if [ -f "build/api" ]; then
    lftp -c "set ftp:ssl-allow no; open -u $FTP_USER,$FTP_PASS $FTP_HOST; mkdir -p $BACKEND_DIR; put -o ${BACKEND_DIR}api build/api; put -o ${BACKEND_DIR}.env build/.env"
else
    echo "Error: build/api not found. Did you build it?"
    exit 1
fi

# 3. Restart Backend (via SSH)
echo "-----------------------------------"
echo "Restarting backend..."
echo "Command: pkill -f api; cd $BACKEND_DIR; chmod +x api; screen -dmS vwt-api ./api"
# Note: This step might require manual execution or sshpass if SSH keys are not set up.
# ssh $FTP_USER@$FTP_HOST "pkill -f api || true; cd $BACKEND_DIR; chmod +x api; screen -dmS vwt-api ./api"

echo "==================================="
echo "Deployment initiated!"
echo "Check: http://voltwavebd.com/ and http://voltwavebd.com:8083/health"
echo "==================================="
