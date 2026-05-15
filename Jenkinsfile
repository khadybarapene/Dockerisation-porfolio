pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend') {
            steps {
                dir('portfolio-api') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('portfolio-api') {
                    sh 'npm test'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('React') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('React') {
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}