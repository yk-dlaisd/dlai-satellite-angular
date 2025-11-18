pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'nexus.yourcompany.com:8083'
        APP_NAME = 'dlai-satellite-angular'
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_NUMBER}"
        AZURE_REGISTRY = 'dlaisdregistry.azurecr.io'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint Code') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'npm test -- --watch=false --browsers=ChromeHeadless'
            }
        }
        
        stage('Build Angular') {
            steps {
                sh 'npm run build:ssr'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_IMAGE}'
            }
        }
        
        stage('Push to Nexus') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}") {
                        docker.image("${DOCKER_IMAGE}").push()
                    }
                }
            }
        }
        
        stage('Deploy to Azure Dev') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh """
                    az login --service-principal -u \$AZURE_SP_ID -p \$AZURE_SP_SECRET --tenant \$AZURE_TENANT_ID
                    az containerapp update --name dlai-dev --resource-group dlai-rg --image ${DOCKER_IMAGE}
                    """
                }
            }
        }
        
        stage('Deploy to Azure Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                    az login --service-principal -u \$AZURE_SP_ID -p \$AZURE_SP_SECRET --tenant \$AZURE_TENANT_ID
                    
                    # Deploy to India West (Primary)
                    az containerapp update --name dlai-prod-india --resource-group dlai-rg-india --image ${DOCKER_IMAGE}
                    
                    # Deploy to US West (Secondary)
                    az containerapp update --name dlai-prod-us --resource-group dlai-rg-us --image ${DOCKER_IMAGE}
                    """
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend channel: '#deployments', message: "SUCCESS: ${APP_NAME} build ${env.BUILD_NUMBER} deployed successfully"
        }
        failure {
            slackSend channel: '#deployments', message: "FAILED: ${APP_NAME} build ${env.BUILD_NUMBER} failed"
        }
    }
}
