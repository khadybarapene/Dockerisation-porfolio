
pipeline {

    agent any

    environment {
        DOCKERHUB_USER      = 'khady2026'
        BACKEND_IMAGE       = 'khady2026/portfolio-api'
        FRONTEND_IMAGE      = 'khady2026/portfolio-react'
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

                echo '=== ETAPE 1 : Recuperation du code source ==='

                checkout scm

                echo "=== Commit : ${env.GIT_COMMIT?.take(7)} ==="
            }
        }

        stage('Verification') {
            steps {

                echo '=== ETAPE 2 : Verification environnement Docker ==='

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

                echo '=== ETAPE 4 : Push Docker Hub ==='

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

                echo '=== Images poussees avec succes ==='
            }
        }

        stage('Deploiement') {
            steps {

                echo '=== ETAPE 5 : Deploiement des conteneurs ==='

                sh '''
                    echo "=== Suppression anciens conteneurs ==="

                    docker rm -f portfolio-react || true
                    docker rm -f portfolio-api || true
                    docker rm -f portfolio-mongo || true

                    echo "=== Docker Compose Down ==="

                    docker compose \
                    -p ${COMPOSE_PROJECT_NAME} \
                    -f ${WORKSPACE}/docker-compose.yml \
                    down --remove-orphans || true

                    echo "=== Nettoyage Docker ==="

                    docker system prune -f || true

                    echo "=== Demarrage nouveaux conteneurs ==="

                    docker compose \
                    -p ${COMPOSE_PROJECT_NAME} \
                    -f ${WORKSPACE}/docker-compose.yml \
                    up -d --build --remove-orphans

                    echo "=== Attente demarrage services ==="

                    sleep 30
                '''
            }
        }

        stage('Health Check') {
            steps {

                echo '=== ETAPE 6 : Verification application ==='

                echo '=== Verification Backend API ==='

                sh '''
                    for i in 1 2 3 4 5
                    do
                        if curl -fsS http://127.0.0.1:5000/
                        then
                            echo "Backend OK"
                            exit 0
                        fi

                        echo "Tentative $i echouee"

                        docker logs --tail 50 portfolio-api || true

                        sleep 5
                    done

                    echo "Backend inaccessible"

                    exit 1
                '''

                echo '=== Verification Frontend React ==='

                sh '''
                    for i in 1 2 3 4 5
                    do
                        if curl -fsS http://127.0.0.1:3000/
                        then
                            echo "Frontend OK"
                            exit 0
                        fi

                        echo "Tentative $i echouee"

                        docker logs --tail 50 portfolio-react || true

                        sleep 5
                    done

                    echo "Frontend inaccessible"

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
                         subject: "SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                         body: """
Le pipeline Jenkins a reussi.

Projet : ${env.JOB_NAME}
Build  : #${env.BUILD_NUMBER}

Frontend :
http://localhost:3000

Backend :
http://localhost:5000
"""
                } catch (err) {
                    echo "Mail failed in success post: ${err}"
                }
            }
        }

        failure {

            echo '=== PIPELINE ECHOUE ==='

            script {
                try {
                    mail to: 'mn2243d@gmail.com',
                         subject: "ECHEC - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                         body: """
Le pipeline Jenkins a echoue.

Projet : ${env.JOB_NAME}
Build  : #${env.BUILD_NUMBER}

Consultez les logs Jenkins.
"""
                } catch (err) {
                    echo "Mail failed in failure post: ${err}"
                }
            }
        }

        always {

            sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" || true'

            echo '=== Fin du pipeline ==='
        }
    }
}
