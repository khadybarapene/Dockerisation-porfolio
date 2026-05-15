pipeline {
    agent any

    stages {
        stage('Build frontend') {
             steps {
                echo 'Building frontend...'
                cd 'react-frontend' 
                npm install
                npm run build
                
            }
        }
        stage('Build backend') {
            steps {
                echo 'Building backend...'
                cd 'porfolio-api'
                npm install
                npm run build
                 // Change to your backend directory
                // Add your backend build steps here
            }
        }
    }
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