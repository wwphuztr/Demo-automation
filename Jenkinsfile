pipeline {
    agent { 
        docker { 
            image 'mcr.microsoft.com/playwright:v1.44.1-jammy'
        } 
    }
    stages {
        stage('e2e-tests') {
            steps {
                script {
                    // Set npm cache directory to a location within the workspace
                    def npmCacheDir = "${env.WORKSPACE}/.npm"
                    sh "npm config set cache ${npmCacheDir}"
                }
                sh 'npm ci --unsafe-perm'
                sh 'npx playwright test'
            }
        }
    }
}
