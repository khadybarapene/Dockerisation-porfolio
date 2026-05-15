pipeline {
    agent any

    environment {
        HUB = 'khady2026'
        TAG = "${BUILD_NUMBER}"

        IMAGE_FRONTEND = 'portfolio-react'
        IMAGE_BACKEND  = 'portfolio-api'
        IMAGE_MONGO    = 'portfolio-mongo'
    }

    stages {

        stage('Build Backend') {
            steps {
                dir('portfolio-api') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}