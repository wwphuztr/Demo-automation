pipeline {
   agent any
   stages {
      stage('e2e-tests') {
         steps {
            bat 'npm ci'
            bat 'npx playwright test'
         }
      }
   }
}