pipeline {
   agent { 
      docker { 
         image 'mcr.microsoft.com/playwright:v1.44.1-jammy' 
         } 
      }
   stages {
      stage('e2e-tests') {
         steps {
            // sh 'npm install'
            sh 'ls'
            sh 'npm cache clean --force'
            sh 'npm i sharp --unsafe-perm'
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}