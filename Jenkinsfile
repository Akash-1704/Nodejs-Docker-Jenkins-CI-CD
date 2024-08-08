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
                git 'https://github.com/Akash-1704/Nodejs-Docker-Jenkins-CI-CD.git'
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
                    docker.withRegistry("https://${DOCKER_HUB_REGISTRY}", 'dockerhub-credentials') {
                        docker.image("${DOCKER_HUB_REPO}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
        stage('Clean up containers') {   //if container runs it will stop and remove this block
          steps {
           script {
               withDockerServer(url: "${DOCKER_HOST}", credentialsId: 'docker-remote') {
                   try {
                       sh 'docker stop nodejs-app'
                       sh 'docker rm nodejs-app'
                   } catch (Exception e) {
                       echo "Container pet1 not found, moving to next stage"  
                }
            }
          }
        }
    }
        stage('Deploy to conatiner'){
            steps{
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

