pipeline {
    agent any
    environment {
        DOCKER_HOST = 'tcp://172.31.33.201:2376'
        DOCKER_HUB_REGISTRY = 'docker.io'
        DOCKER_HUB_REPO = 'sky170496/my-node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        IMAGE_NAME = "${DOCKER_HUB_REPO}:${IMAGE_TAG}"
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Akash-1704/Nodejs-Docker-Jenkins-CI-CD.git',
                    branch: 'main'
                )
            }
        }
        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {   
                        sh "docker build -t ${IMAGE_NAME} ."
                        sh "docker push ${IMAGE_NAME}"
                    }
                }
            }
        }
        stage('Clean up containers') {
            steps {
                script {
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker-remote') {
                        try {
                            sh 'docker stop my-node-app || true'
                            sh 'docker rm my-node-app || true'
                        } catch (Exception e) {
                            echo "Container my-node-app not found, moving to the next stage"
                        }
                    }
                }
            }
        }
        stage('Deploy to Container') {
            steps {
                script {
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker') {
                        sh "docker pull ${IMAGE_NAME}"
                        sh "docker run -d --name my-node-app --restart always -p 80:3000 ${IMAGE_NAME}"
                    }
                }
            }
        }
        stage('Remove Old Images') {
            steps {
                script {
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker') {
                        sh """
                        docker images ${DOCKER_HUB_REPO} --format '{{.Tag}}' | sort -n | head -n -3 | xargs -I {} docker rmi ${DOCKER_HUB_REPO}:{}
                        """
                    }
                }
            }
        }
    }
}
