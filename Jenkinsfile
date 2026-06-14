pipeline {
    agent any

    options {
        buildDiscarder(logRotator(
            numToKeepStr: '20',
            artifactNumToKeepStr: '10'
        ))
        timestamps()
    }

    environment {
        FTP_HOST     = 'voltwavebd.com'
        SSH_HOST     = 'voltwavebd.com'

        FRONTEND_DIR  = 'public_html'
        BACKEND_DIR   = 'app'
        API_PROXY_DIR = 'api.voltwavebd.com/public_html/api/'

        GOOS        = 'linux'
        GOARCH      = 'amd64'
        CGO_ENABLED = '0'
    }

    stages {

        // ──────────────────────────────────────────────────────────────
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat '''
                    set GOOS=linux
                    set GOARCH=amd64
                    set CGO_ENABLED=0
                    go mod tidy
                    go build -ldflags="-s -w" -o ..\\build\\api ./cmd/api
                    '''

                    // Copy .env.production next to the binary so the binary
                    // auto-detects production mode from its own directory.
                    bat '''
                    if exist .env.production (
                        copy .env.production ..\\build\\.env.production
                    )
                    '''
                }
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // Vite reads mode=production automatically → uses VITE_PROD_* URLs
                    bat 'npm run build'
                }
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Deploy Frontend') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'ftp-prod',
                        usernameVariable: 'FTP_USER',
                        passwordVariable: 'FTP_PASS'
                    )
                ]) {
                    dir('frontend/dist') {
                        bat '''
                        lftp -c "set ftp:ssl-allow no; ^
                        open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; ^
                        mirror -R --delete . %FRONTEND_DIR%"
                        '''
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Deploy Backend Binary') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'ftp-prod',
                        usernameVariable: 'FTP_USER',
                        passwordVariable: 'FTP_PASS'
                    )
                ]) {
                    dir('build') {
                        bat '''
                        lftp -c "set ftp:ssl-allow no; open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; ^
                        mkdir -p %BACKEND_DIR%; ^
                        put -o %BACKEND_DIR%/api api; ^
                        put -o %BACKEND_DIR%/.env.production .env.production"
                        '''
                    }
                    // Upload the server-side restart + watchdog scripts
                    dir('scripts') {
                        bat '''
                        lftp -c "set ftp:ssl-allow no; open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; ^
                        put -o %BACKEND_DIR%/restart-api.sh restart-api.sh; ^
                        put -o %BACKEND_DIR%/watchdog.sh watchdog.sh"
                        '''
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Deploy API Proxy') {
            // Deploys backend/api-proxy/ to api.voltwavebd.com/public_html/
            // This replaces the old PHP passenger script with our lean proxy.
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'ftp-prod',
                        usernameVariable: 'FTP_USER',
                        passwordVariable: 'FTP_PASS'
                    )
                ]) {
                    dir('backend/api-proxy') {
                        bat '''
                        lftp -c "set ftp:ssl-allow no; open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; ^
                        mirror -R --delete . %API_PROXY_DIR%"
                        '''
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────────────
        stage('Restart Backend via SSH') {
            // Requires Jenkins credential 'ssh-prod' (SSH Username with private key).
            // The SSH key must be added to ~/.ssh/authorized_keys on the server.
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ssh-prod',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    bat '''
                    ssh -i %SSH_KEY% ^
                        -o StrictHostKeyChecking=no ^
                        -o BatchMode=yes ^
                        %SSH_USER%@%SSH_HOST% ^
                        "chmod +x ~/app/restart-api.sh && bash ~/app/restart-api.sh"
                    '''
                }
            }
        }

    }

    post {
        success {
            echo '✅ Deployment Successful — API is live at http://api.voltwavebd.com'
        }
        failure {
            echo '❌ Deployment Failed — check the logs above'
        }
        always {
            cleanWs()
        }
    }
}