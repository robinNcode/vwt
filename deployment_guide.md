# VWT Shared Hosting Deployment Guide

## Architecture Overview

```
Browser → api.voltwavebd.com (Apache, port 80)
           └── api-proxy/index.php (PHP reverse proxy)
                └── http://127.0.0.1:8083 (Go binary in screen session)
```

**Why PHP proxy?** On shared hosting, Apache controls port 80. The Go binary runs on port 8083. The PHP script bridges them — it's the standard workaround for running custom binaries on cPanel/shared hosting.

---

## Files Created

| File | Purpose |
|---|---|
| `backend/api-proxy/index.php` | PHP reverse proxy (replaces old passenger script) |
| `backend/api-proxy/.htaccess` | Routes all requests through `index.php` |
| `scripts/restart-api.sh` | Server-side: kills old screen, starts new one |
| `scripts/watchdog.sh` | Server-side: cron watchdog to auto-restart if crashed |
| `Jenkinsfile` | Updated CI/CD pipeline |

---

## Jenkins Setup (One-Time)

You need **two credentials** in Jenkins:

### 1. `ftp-prod` (already exists — FTP upload)
- Type: **Username with password**
- ID: `ftp-prod`

### 2. `ssh-prod` (new — SSH restart)
- Type: **SSH Username with private key**
- ID: `ssh-prod`
- Username: your hosting SSH user (e.g. `voltwavebd`)
- Private key: paste your SSH private key

> [!IMPORTANT]
> Add your SSH public key to the server first:
> ```bash
> # On server (via terminal)
> mkdir -p ~/.ssh
> echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
> chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
> ```

---

## One-Time Server Setup (First Deploy Only)

SSH into your server and run these commands once:

```bash
# 1. Create the app directory
mkdir -p ~/app

# 2. Upload the binary manually the first time (or via FTP)
# Then make it executable:
chmod +x ~/app/api

# 3. Copy .env.production into place (if not done via FTP)
# It must sit next to the binary in ~/app/

# 4. Set up the cron watchdog (restarts if crashed)
crontab -e
# Add this line:
*/5 * * * * bash ~/app/watchdog.sh >> ~/app/watchdog.log 2>&1

# 5. Start the API for the first time
bash ~/app/restart-api.sh
```

---

## Automated Deployment (Jenkins)

Every push triggers the pipeline automatically:

```
1. Checkout Source
2. Install Frontend Dependencies  (npm ci)
3. Build Backend                  (Go → Linux binary)
4. Build Frontend                 (Vite → dist/)
5. Deploy Frontend                (FTP → public_html/)
6. Deploy Backend Binary          (FTP → app/api + app/.env.production)
7. Deploy API Proxy               (FTP → api.voltwavebd.com/public_html/)
8. Restart Backend via SSH        (SSH → bash ~/app/restart-api.sh)
```

---

## Verify Deployment

```bash
# On server — check Go is running
screen -ls
# Expected: There is a screen on: XXXX.vwt (Detached)

# Test preflight (CORS)
curl -si https://api.voltwavebd.com/api/v1/auth/login \
  -X OPTIONS \
  -H 'Origin: https://voltwavebd.com' \
  -H 'Access-Control-Request-Method: POST'
# Expected: HTTP 204, Access-Control-Allow-Origin: https://voltwavebd.com

# Test login
curl -s https://api.voltwavebd.com/api/v1/auth/login \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@voltwave.tech","password":"Admin@123","type":"admin"}'
```

---

## Troubleshooting

| Symptom | Check | Fix |
|---|---|---|
| `502 Bad Gateway` from PHP | Go binary not running | `screen -ls` → `bash ~/app/restart-api.sh` |
| `404` from Apache | API proxy not deployed | Check `api.voltwavebd.com/public_html/index.php` exists |
| CORS error | Wrong `CORS_ORIGINS` in `.env.production` | Update and redeploy |
| Binary doesn't load `.env.production` | File not next to binary | `ls ~/app/` — must show both `api` and `.env.production` |
| Screen session dies | No watchdog | Add cron: `*/5 * * * * bash ~/app/watchdog.sh` |
| SSH step fails in Jenkins | `ssh-prod` credential missing | Add SSH key credential in Jenkins |

---

## Manual Restart (Emergency)

SSH into your server and run:

```bash
cd ~/app
screen -S vwt -X quit 2>/dev/null || true
pkill -f "app/api" || true
sleep 1
screen -dmS vwt bash -c "cd ~/app && ./api >> ~/app/api.log 2>&1"
screen -ls
```
