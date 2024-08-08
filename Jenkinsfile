pipeline {
    agent any
    environment {
        DOCKER_HOST = 'tcp://172.31.33.201:2376'
        DOCKER_HUB_REGISTRY = 'docker.io'
        DOCKER_HUB_REPO = 'sky170496/my-node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Akash-1704/Nodejs-Docker-Jenkins-CI-CD.git',
                    branch: 'main'
                )
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_HUB_REPO}:${IMAGE_TAG}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_HUB_REGISTRY}/v1/", 'docker') {
                        docker.image("${DOCKER_HUB_REPO}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
        stage('Clean up containers') {
            steps {
                script {
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker-remote') {
                        try {
                            sh 'docker stop my-node-app'
                            sh 'docker rm my-node-app'
                        } catch (Exception e) {
                            echo "Container my-node-app not found, moving to next stage"
                        }
                    }
                }
            }
        }
        stage('Deploy to container') {
            steps {
                script {
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker-remote') {
                        sh "docker pull ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                        sh "docker run -d --name my-node-app --restart always -p 80:3000 ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    }
                }
            }
        }
    }
}
