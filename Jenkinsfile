pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = 'khady2026/portfolio-api'
        FRONTEND_IMAGE = 'khady2026/portfolio-react'
    }

    triggers { githubPush() }

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verification') {
            steps {
                sh 'docker --version && docker compose version'
                sh 'docker ps --format "table {{.Names}}\\t{{.Status}}"'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker compose -f ${WORKSPACE}/docker-compose.yml build"
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploiement') {
    steps {
        sh '''
            docker rm -f portfolio-mongo portfolio-api portfolio-react || true
            docker compose -f ${WORKSPACE}/docker-compose.yml down --remove-orphans || true
            docker compose -f ${WORKSPACE}/docker-compose.yml up -d --build
            sleep 30
        '''
    }
}

        stage('Health Check') {
            steps {
                sh '''
                    for i in 1 2 3 4 5; do
                        curl -fsS http://127.0.0.1:5000/ && echo "Backend OK" && break
                        sleep 5
                    done
                    for i in 1 2 3 4 5; do
                        curl -fsS http://127.0.0.1:3000/ && echo "Frontend OK" && break
                        sleep 5
                    done
                '''
            }
        }
    }

    post {
        success {
            mail to: 'khadypene267@gmail.com',
                 subject: "✅ SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Pipeline réussi.\nFrontend: http://localhost:3000\nBackend: http://localhost:5000"
        }
        failure {
            mail to: 'khadypene267@gmail.com',
                 subject: "❌ ECHEC - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Pipeline échoué.\nLogs: ${env.BUILD_URL}console"
        }
        always {
            sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" || true'
        }
    }
}