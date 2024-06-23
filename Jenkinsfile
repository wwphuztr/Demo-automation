pipeline {
   agent { 
      docker { 
         image 'mcr.microsoft.com/playwright:v1.17.2-focal' 
         } 
      }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'npm install'
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}