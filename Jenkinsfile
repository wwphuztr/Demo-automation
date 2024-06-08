pipeline {
   agent any
   stages {
      stage('e2e-tests') {
         steps {
            bat 'npm install'
            bat 'npx playwright install'
            bat 'npm ci'
            bat 'npx playwright test'
         }
      }
   }
}