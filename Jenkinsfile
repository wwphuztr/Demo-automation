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
            sh 'sudo chown -R 987:981 "/.npm"'
            sh 'npm cache clean --force'
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}