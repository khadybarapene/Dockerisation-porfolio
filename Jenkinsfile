pipeline {
    agent any

    environment {
        PROJECT_DIR = 'Express_MongoDB_V6'
        DOCKERHUB_USER = 'khady2026'
        BACKEND_IMAGE = 'khady2026/portfolio-api'
        FRONTEND_IMAGE = 'khady2026/portfolio-react'
    }

    triggers {
        githubPush()
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo '=== ETAPE 1 : Recuperation du code source depuis GitHub ==='
                checkout scm
                echo "=== Commit : ${env.GIT_COMMIT?.take(7)} ==="
            }
        }

        
        stage('Verification') {
            steps {
                echo '=== ETAPE 2 : Verification de l environnement Docker ==='
                sh 'docker --version'
                sh 'docker compose version'
                sh "ls -la ${WORKSPACE}//"
                sh 'docker ps --format "table {{.Names}}\\t{{.Status}}"'
            }
        }

       
        stage('Docker Build') {
            steps {
                echo '=== ETAPE 3 : Construction des images Docker ==='
                sh "docker compose -f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml build"
                echo '=== Images construites avec succes ==='
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo '=== ETAPE 4 : Push des images vers Docker Hub ==='
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag express_mongodb_v6-backend:latest ${BACKEND_IMAGE}:latest
                        docker tag express_mongodb_v6-backend:latest ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker tag express_mongodb_v6-frontend:latest ${FRONTEND_IMAGE}:latest
                        docker tag express_mongodb_v6-frontend:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker logout
                    '''
                }
                echo '=== Images poussees vers Docker Hub ==='
            }
        }

        
        stage('Deploiement') {
            steps {
                echo '=== ETAPE 5 : Deploiement des conteneurs ==='
                echo '    Arret des anciens conteneurs...'
                sh "docker compose -f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml down || true"
                echo '    Demarrage des nouveaux conteneurs (-d = arriere-plan)...'
                sh "docker compose -f ${WORKSPACE}/${PROJECT_DIR}/docker-compose.yml up -d"
                echo '    Attente demarrage MongoDB + Backend (30s)...'
                sh 'sleep 30'
            }
        }

        
        stage('Health Check') {
            steps {
                echo '=== ETAPE 6 : Verification de l application ==='
                echo '    Test API Backend (depuis le conteneur portfolio_backend)...'
                sh 'docker exec portfolio_backend wget --spider -q http://127.0.0.1:5000/api/health'
                echo '    Test Frontend React (depuis le conteneur portfolio_frontend)...'
                sh '''
                    for i in 1 2 3 4 5; do
                        docker exec portfolio_frontend wget --spider -q http://127.0.0.1:80 && exit 0
                        echo "    Tentative $i echouee, retry dans 5s..."
                        sleep 5
                    done
                    exit 1
                '''
                echo '=== Application operationnelle ==='
            }
        }

    }

   
    post {
        success {
            echo '=== PIPELINE REUSSI - Application deployee ! Frontend: http://localhost | API: http://localhost:5000/api/health ==='
            mail to: 'mn2243d@gmail.com',
                 subject: "✅ Jenkins - Build SUCCESS : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """Le pipeline ${env.JOB_NAME} a réussi.

Commit : ${env.GIT_COMMIT?.take(7)}
Build  : ${env.BUILD_URL}

Application déployée :
- Frontend : http://localhost
- API      : http://localhost:5000/api/health
"""
        }
        failure {
            echo '=== PIPELINE ECHOUE - Consultez les logs ci-dessus pour identifier le stage en erreur ==='
            mail to: 'mn2243d@gmail.com',
                 subject: "❌ Jenkins - Build FAILED : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """Le pipeline ${env.JOB_NAME} a échoué.

Commit : ${env.GIT_COMMIT?.take(7)}
Build  : ${env.BUILD_URL}

Consultez les logs pour identifier l'erreur.
"""
        }
        always {
            sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" || true'
            echo '=== Fin du pipeline ==='
        }
    }
}