pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'anusha2105/student-management'
        EC2_HOST = '15.252.98.230'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%BUILD_NUMBER% .'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'docker run --rm %DOCKER_IMAGE%:%BUILD_NUMBER% pytest'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    bat 'echo %DOCKER_PASSWORD% | docker login -u "%DOCKER_USERNAME%" --password-stdin'
                    bat 'docker push %DOCKER_IMAGE%:%BUILD_NUMBER%'
                    bat 'docker tag %DOCKER_IMAGE%:%BUILD_NUMBER% %DOCKER_IMAGE%:latest'
                    bat 'docker push %DOCKER_IMAGE%:latest'
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
                    icacls "%SSH_KEY%" /inheritance:r
                    icacls "%SSH_KEY%" /remove:g "BUILTIN\\Users"
                    icacls "%SSH_KEY%" /grant:r "SYSTEM:R"
                    
                    ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %SSH_USER%@%EC2_HOST% "sudo docker pull %DOCKER_IMAGE%:latest && sudo docker rm -f student-management || true && sudo docker run -d -p 5000:5000 --name student-management %DOCKER_IMAGE%:latest"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'CI/CD pipeline failed!'
        }
    }
}