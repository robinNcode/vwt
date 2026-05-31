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
        FTP_HOST = 'voltwavebd.com'

        FRONTEND_DIR = 'public_html'
        BACKEND_DIR = 'app'

        GOOS = 'linux'
        GOARCH = 'amd64'
        CGO_ENABLED = '0'
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

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

                    bat '''
                    if exist .env.production (
                        copy .env.production ..\\build\\.env
                    )
                    '''

                    bat '''
                    if not exist ..\\build\\storage\\settings (
                        mkdir ..\\build\\storage\\settings
                    )
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

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
                        lftp -c "set ftp:ssl-allow no; \
                        open -u %FTP_USER%,%FTP_PASS% %FTP_HOST%; \
                        mirror -R --delete . %FRONTEND_DIR%"
                        '''
                    }
                }
            }
        }

        stage('Deploy Backend') {

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
                        curl -u "%FTP_USER%:%FTP_PASS%" ^
                        --ftp-create-dirs ^
                        -T api ^
                        "ftp://%FTP_HOST%/%BACKEND_DIR%/api"
                        '''

                        bat '''
                        curl -u "%FTP_USER%:%FTP_PASS%" ^
                        --ftp-create-dirs ^
                        -T .env ^
                        "ftp://%FTP_HOST%/%BACKEND_DIR%/.env"
                        '''
                    }
                }
            }
        }

        stage('Deployment Instructions') {
            steps {

                echo '''
Run on Linux Server:

cd ~/app

chmod +x api

pkill -f api || true

nohup ./api > app.log 2>&1 &
'''
            }
        }
    }

    post {

        success {
            echo 'Deployment Successful'
        }

        failure {
            echo 'Deployment Failed'
        }

        always {
            cleanWs()
        }
    }
}