pipeline {
    environment {
        registry = "k0walski/presse_idependante_gwendhal_claudel_api"
        registryCredential = "docker_hub_token"
        dockerImage = ""
    }
    agent none

    stages {
        stage("Lint, Test, Merge, Build, and push to the Docker Hub") {
            agent {
                label "linux"
            }
            stages {
                stage('Fetch last commits') {
                    steps {
                        git branch: 'develop', credentialsId: 'jenkins_github_token', url: 'https://github.com/K0WALSKl/PresseIndependanteAPI.git'
                    }
                }
                stage('Lint') {
                    steps {
                        sh "docker-compose -f docker-compose.dev.yml run api npm run lint"
                        sh "docker stop db && docker rm \$(docker ps -aq --filter 'status=exited')"
                    }
                }
                stage('Test') {
                    steps {
                        sh "docker-compose --env-file .env.test -f docker-compose.dev.yml run api npm run ci"
                        sh "docker stop db && docker rm \$(docker ps -aq --filter 'status=exited')"
                    }
                }
                stage('Build and push the API image') {
                    steps {
                        script {
                            dockerImage = docker.build registry + ":0.$BUILD_NUMBER"
                            docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                                dockerImage.push()
                            }
                        }
                    }
                }
            }
            post {
                success {
                    junit 'test-results.xml'
                }
            }
        }
        stage("Deploy") {
            agent {
                label "production"
            }
            stages {
                stage('Deploy on master node') {
                    steps {
                        git branch: 'develop', credentialsId: 'jenkins_github_token', url: 'https://github.com/K0WALSKl/PresseIndependanteAPI.git'
                        sh "docker-compose -f docker-compose.prod.yml down || true"
                        sh "docker image prune -af"
                        sh "docker-compose --env-file $ENV_PROD_PATH -f docker-compose.prod.yml up -d"
                    }
                }
            }
            post {
                failure {
                    sh "docker-compose --env-file $ENV_PROD_PATH -f docker-compose.prod.yml up -d"
                }
            }
        }
    }
}