pipeline {
    agent any

    stages {

        stage('Backend') {
            steps {
                dir('portfolio-api') {
                    sh 'npm ci'
                    sh 'MONGO_URI=mongodb://localhost:27017/portfolioDB npm test'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('React') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('React') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy OK'
            }
        }
    }
}