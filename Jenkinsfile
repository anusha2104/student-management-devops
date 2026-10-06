pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t student-management:%BUILD_NUMBER% .'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'docker run --rm student-management:%BUILD_NUMBER% pytest'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker rm -f student-app 2>NUL || exit /b 0'
                bat 'docker run -d -p 5000:5000 --name student-app student-management:%BUILD_NUMBER%'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}