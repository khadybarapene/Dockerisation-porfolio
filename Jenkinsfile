```groovy
pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'khady2026'
        BACKEND_IMAGE = 'khady2026/portfolio-api'
        FRONTEND_IMAGE = 'khady2026/portfolio-react'
        COMPOSE_PROJECT_NAME = 'portfolio'
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

                sh "ls -la ${WORKSPACE}/"

                sh 'docker ps --format "table {{.Names}}\\t{{.Status}}"'
            }
        }

        stage('Docker Build') {
            steps {
                echo '=== ETAPE 3 : Construction des images Docker ==='

                sh """
                    docker compose \
                    -p ${COMPOSE_PROJECT_NAME} \
                    -f ${WORKSPACE}/docker-compose.yml \
                    build
                """

                echo '=== Images construites avec succes ==='
            }
        }

        stage('Push Docker Hub') {
            steps {

                echo '=== ETAPE 4 : Push des images vers Docker Hub ==='

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker tag ${BACKEND_IMAGE}:latest ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker tag ${FRONTEND_IMAGE}:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER}

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

                sh '''
                    echo "Suppression des anciens conteneurs..."
                    docker rm -f portfolio-react portfolio-api portfolio-mongo || true
                '''

                sh """
                    docker compose \
                    -p ${COMPOSE_PROJECT_NAME} \
                    -f ${WORKSPACE}/docker-compose.yml \
                    down --remove-orphans || true
                """

                sh """
                    docker compose \
                    -p ${COMPOSE_PROJECT_NAME} \
                    -f ${WORKSPACE}/docker-compose.yml \
                    up -d --remove-orphans
                """

                echo '=== Attente demarrage services ==='

                sh 'sleep 30'
            }
        }

        stage('Health Check') {
            steps {

                echo '=== ETAPE 6 : Verification de l application ==='

                echo '=== Test Backend API ==='

                sh '''
                    for i in 1 2 3 4 5; do

                        curl -fsS http://127.0.0.1:5000/ && break || {

                            echo "Tentative $i echouee"

                            docker logs --tail 50 portfolio-api || true

                            sleep 5
                        }
                    done

                    curl -fsS http://127.0.0.1:5000/ || exit 1
                '''

                echo '=== Test Frontend React ==='

                sh '''
                    for i in 1 2 3 4 5; do

                        curl -fsS http://127.0.0.1:3000 && exit 0 || {

                            echo "Tentative $i echouee"

                            sleep 5
                        }
                    done

                    exit 1
                '''

                echo '=== Application operationnelle ==='
            }
        }
    }

    post {

        success {

            echo '=== PIPELINE REUSSI ==='

            script {

                try {

                    mail to: 'mn2243d@gmail.com',
                    subject: "✅ Jenkins SUCCESS : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
Le pipeline Jenkins a réussi.

Commit : ${env.GIT_COMMIT?.take(7)}

Build :
${env.BUILD_URL}

Application déployée :

Frontend :
http://localhost:3000

Backend :
http://localhost:5000
"""

                } catch (err) {

                    echo "Mail failed (success): ${err}"
                }
            }
        }

        failure {

            echo '=== PIPELINE ECHOUE ==='

            script {

                try {

                    mail to: 'khadypene267@gmail.com',
                    subject: "❌ Jenkins FAILED : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
Le pipeline Jenkins a échoué.

Commit :
${env.GIT_COMMIT?.take(7)}

Build :
${env.BUILD_URL}

Consultez les logs Jenkins.
"""

                } catch (err) {

                    echo "Mail failed (failure): ${err}"
                }
            }
        }

        always {

            sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" || true'

            echo '=== Fin du pipeline ==='
        }
    }
}
```
