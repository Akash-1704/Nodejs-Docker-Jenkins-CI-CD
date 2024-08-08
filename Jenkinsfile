pipeline {
    agent any
    environment {
        DOCKER_HOST = 'tcp://172.31.33.201:2376'
        DOCKER_HUB_REGISTRY = 'docker.io'
        DOCKER_HUB_REPO = 'sky170496/my-node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('clean workspace'){
            steps{
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
        stage("Docker Build & Push"){
            steps{
                script{
                   withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){   
                       sh "docker build -t sky170496/my-node-app ."
                       sh "docker tag sky170496/my-node-app:latest docker.io/sky170496/my-node-app:${IMAGE_TAG}"
                       sh "docker push sky170496/my-node-app:${IMAGE_TAG}"
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
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker') {
                        sh "docker pull ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                        sh "docker run -d --name my-node-app --restart always -p 80:3000 ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    }
                }
            }
        }
        stage('Remove unused images') {
            steps {
                script {
                    withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker') {
                        sh "docker image prune -f"
                    }
                }
            }
    }
}
