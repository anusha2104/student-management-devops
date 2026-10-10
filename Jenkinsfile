
pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = 'anusha2105/student-management-backend'
        FRONTEND_IMAGE = 'anusha2105/student-management-frontend'
        EC2_HOST       = '15.252.98.230'
        DEPLOY_DIR     = '/opt/student-management'
    }

    stages {
        stage('Validate Source') {
            steps {
                bat 'docker run --rm -v "%CD%\\backend:/app" -w /app python:3.12-slim python -m compileall -q app.py models.py test_app.py'
                bat 'docker compose -f docker-compose.yml config -q'
                bat 'docker compose -f docker-compose.prod.yml config -q'
            }
        }

        stage('Build Backend') {
            steps {
                bat 'docker build -t %BACKEND_IMAGE%:%BUILD_NUMBER% ./backend'
            }
        }



        stage('Test Backend') {
            steps {
                bat '''
                docker network create student-test-%BUILD_NUMBER%
                if errorlevel 1 exit /b 1

                docker run -d --name student-test-db-%BUILD_NUMBER% --network student-test-%BUILD_NUMBER% -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=student_management -e MYSQL_USER=student_user -e MYSQL_PASSWORD=student_password mysql:8.0
                if errorlevel 1 exit /b 1

                powershell -NoProfile -Command "$ready=$false; for($i=1; $i -le 60; $i++){ Write-Host ('Waiting for MySQL: attempt ' + $i + '/60'); docker exec student-test-db-%BUILD_NUMBER% mysql -u student_user -pstudent_password student_management -e 'SELECT 1' 2>$null | Out-Null; if($LASTEXITCODE -eq 0){$ready=$true; Write-Host 'MySQL is ready'; break}; Start-Sleep -Seconds 2 }; if(-not $ready){ Write-Host 'MySQL did not become ready. Logs:'; docker logs student-test-db-%BUILD_NUMBER%; exit 1 }"
                if errorlevel 1 exit /b 1

                docker run --rm --network student-test-%BUILD_NUMBER% -e MYSQL_HOST=student-test-db-%BUILD_NUMBER% -e MYSQL_PORT=3306 -e MYSQL_DATABASE=student_management -e MYSQL_USER=student_user -e MYSQL_PASSWORD=student_password --entrypoint pytest %BACKEND_IMAGE%:%BUILD_NUMBER% -q
                '''
            }
            post {
                always {
                    bat 'docker rm -f student-test-db-%BUILD_NUMBER% 2>NUL || exit /b 0'
                    bat 'docker network rm student-test-%BUILD_NUMBER% 2>NUL || exit /b 0'
                }
            }
        }





        stage('Build Frontend') {
            steps {
                bat 'docker build -t %FRONTEND_IMAGE%:%BUILD_NUMBER% ./frontend'
            }
        }

        stage('Publish Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {

                    bat '''
                    echo %DOCKER_PASSWORD% | docker login -u "%DOCKER_USERNAME%" --password-stdin
                    if errorlevel 1 exit /b 1

                    docker tag %BACKEND_IMAGE%:%BUILD_NUMBER% %BACKEND_IMAGE%:latest
                    if errorlevel 1 exit /b 1

                    docker tag %FRONTEND_IMAGE%:%BUILD_NUMBER% %FRONTEND_IMAGE%:latest
                    if errorlevel 1 exit /b 1

                    docker push %BACKEND_IMAGE%:%BUILD_NUMBER%
                    if errorlevel 1 exit /b 1

                    docker push %BACKEND_IMAGE%:latest
                    if errorlevel 1 exit /b 1

                    docker push %FRONTEND_IMAGE%:%BUILD_NUMBER%
                    if errorlevel 1 exit /b 1

                    docker push %FRONTEND_IMAGE%:latest
                    if errorlevel 1 exit /b 1
                    '''

                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-ssh-key',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    bat '''
                    @echo on
                    icacls "%SSH_KEY%" /inheritance:r
                    if errorlevel 1 exit /b 1

                    @echo on
                    icacls "%SSH_KEY%" /grant:r "SYSTEM:R"
                    if errorlevel 1 exit /b 1

                    ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %SSH_USER%@%EC2_HOST% "sudo mkdir -p %DEPLOY_DIR% && sudo chown %SSH_USER%:%SSH_USER% %DEPLOY_DIR%"
                    if errorlevel 1 exit /b 1

                    scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no docker-compose.prod.yml %SSH_USER%@%EC2_HOST%:%DEPLOY_DIR%/docker-compose.yml
                    if errorlevel 1 exit /b 1

                    ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %SSH_USER%@%EC2_HOST% "cd %DEPLOY_DIR% && sudo IMAGE_TAG=%BUILD_NUMBER% docker compose pull && sudo IMAGE_TAG=%BUILD_NUMBER% docker compose up -d"
                    if errorlevel 1 exit /b 1
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'UniCloud CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'UniCloud CI/CD pipeline failed. Check the stage logs.'
        }
    }
}
