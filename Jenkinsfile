pipeline {
    agent any

    stages {
        stage('Build frontend') {
            steps {
                echo 'Building frontend...'
                dir('React') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build backend') {
            steps {
                echo 'Building backend...'
                dir('portfolio-api') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
                // Add your test steps here
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Add your deploy steps here
            }
        }
    }
}