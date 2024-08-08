### Jenkins Pipeline Explanation

This Jenkinsfile defines a CI/CD pipeline that builds, tags, pushes, and deploys a Node.js application using Docker. Here's a breakdown of the pipeline:

#### **Pipeline Structure**

- **Agent**: The pipeline runs on any available Jenkins agent.
- **Environment Variables**:
  - **DOCKER_HOST**: Specifies the Docker host to connect to.
  - **DOCKER_HUB_REGISTRY**: Specifies the Docker Hub registry URL.
  - **DOCKER_HUB_REPO**: The Docker Hub repository where the image will be pushed.
  - **IMAGE_TAG**: The tag for the Docker image, which is dynamically set to the Jenkins build number.

#### **Pipeline Stages**

1. **Clean Workspace**:
   - **Purpose**: Cleans up the workspace to ensure a fresh start for each build. This prevents any leftover files from previous builds from affecting the current build.
   - **Command**: `cleanWs()` is used to remove all files from the workspace.

2. **Checkout**:
   - **Purpose**: Checks out the code from the GitHub repository.
   - **Command**: The `git` step is used to clone the repository from the `main` branch.

3. **Docker Build & Push**:
   - **Purpose**: Builds the Docker image, tags it with the current build number, and pushes the image to Docker Hub.
   - **Commands**:
     ```sh
     docker build -t ${DOCKER_HUB_REPO}:${IMAGE_TAG} .
     docker tag ${DOCKER_HUB_REPO}:${IMAGE_TAG} ${DOCKER_HUB_REPO}:latest
     docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}
     docker push ${DOCKER_HUB_REPO}:latest
     ```

4. **Clean Up Containers**:
   - **Purpose**: Stops and removes the existing container to ensure that the latest version is deployed.
   - **Commands**:
     ```sh
     docker stop my-node-app
     docker rm my-node-app
     ```
   - **Error Handling**: If the container is not found, the pipeline moves to the next stage without failing.

5. **Deploy to Container**:
   - **Purpose**: Pulls the newly built image from Docker Hub and runs it as a container on the Docker host.
   - **Commands**:
     ```sh
     docker pull ${DOCKER_HUB_REPO}:${IMAGE_TAG}
     docker run -d --name my-node-app --restart always -p 80:3000 ${DOCKER_HUB_REPO}:${IMAGE_TAG}
     ```

#### **Key Considerations**

- **Tagging Strategy**: The use of `${IMAGE_TAG}` (which is the build number) as the image tag ensures that each build is uniquely identifiable. This is useful for version control and rollbacks.
- **Error Handling**: The pipeline gracefully handles errors when trying to stop or remove a container that does not exist, ensuring that the pipeline continues without interruption.
- **Deployment Stability**: The pipeline ensures that only one instance of the application is running by stopping and removing any previous instance before deploying the new one.

This Jenkinsfile automates the process of building, tagging, pushing, and deploying your Node.js application, ensuring a consistent and reliable deployment process.
