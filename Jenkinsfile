pipeline {
    agent any

    environment {
        // FTP Credentials
        FTP_HOST = 'voltwavebd.com'
        FTP_USER = 'deploy@voltwavebd.com'
        FTP_PASS = 'PifqCVU)uq9E@z90'
        
        // Target Directories
        FRONTEND_DIR = 'public_html/'
        BACKEND_DIR = 'app/'
        
        // Backend Port
        BACKEND_PORT = '8083'
    }

    triggers {
        pollSCM('* * * * *') // Poll every minute for latest commit
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing Frontend Dependencies...'
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building Backend for Linux...'
                dir('backend') {
                    // cross-compilation on Windows requires setting env vars for the command
                    bat 'set GOOS=linux&& set GOARCH=amd64&& go build -o ../build/api ./cmd/api'
                    // Copy production env
                    bat 'copy .env.production ..\\build\\.env'
                    // Create storage directory
                    bat 'if not exist ..\\build\\storage\\settings mkdir ..\\build\\storage\\settings'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building Frontend...'
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo 'Deploying Frontend via FTP...'
                dir('frontend/dist') {
                    // Check for lftp in windows (assuming Git Bash or similar is installed)
                    // If not, we provide instructions.
                    bat """
                        where lftp >nul 2>nul
                        if %ERRORLEVEL% EQU 0 (
                            lftp -c "set ftp:ssl-allow no; open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; mirror -R . %FRONTEND_DIR%"
                        ) else (
                            echo ERROR: lftp not found in PATH. Please install lftp for Windows.
                            exit 1
                        )
                    """
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                echo 'Deploying Backend via FTP...'
                dir('build') {
                    bat """
                        where lftp >nul 2>nul
                        if %ERRORLEVEL% EQU 0 (
                            lftp -c "set ftp:ssl-allow no; open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; mkdir -p %BACKEND_DIR%; put -o %BACKEND_DIR%api api; put -o %BACKEND_DIR%.env .env"
                        ) else (
                            curl -u "%FTP_USER%:%FTP_PASS%" --ftp-create-dirs -T api "ftp://%FTP_HOST%/%BACKEND_DIR%api"
                            curl -u "%FTP_USER%:%FTP_PASS%" --ftp-create-dirs -T .env "ftp://%FTP_HOST%/%BACKEND_DIR%.env"
                        )
                    """
                }
            }
        }

        stage('Restart Backend') {
            steps {
                echo 'Finalizing Backend Deployment...'
                // If SSH is available on Windows (e.g. OpenSSH), we can try to automate it.
                bat """
                    echo -----------------------------------
                    echo To complete deployment, run this on your server:
                    echo pkill -f api ^|^| true; cd %BACKEND_DIR%; chmod +x api; screen -dmS vwt-api ./api
                    echo -----------------------------------
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Deployment Failed!'
        }
    }
}
