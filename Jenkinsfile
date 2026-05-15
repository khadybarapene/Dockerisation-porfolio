pipeline{
    agent any
    environment{
        IMAGE_NAME = 'portfolio-api'
        IMAGE_NAME = 'portfolio-react'
    }
    stages{
      stage('Build Backend') {
    steps {
        dir('portfolio-api') {
            sh 'npm ci'
            sh 'npm run build'   }


        }

        } 

        stage('Test'){
            steps{
                echo 'Testing...'
            }
        }

        stage('Deploy'){
            steps{
                echo 'Deploying...'
            }
        }
    }
}