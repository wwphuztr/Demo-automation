pipeline {
   agent any
   stages {
      stage('e2e-tests') {
         steps {
            bat 'npm i'
            bat 'npx playwright install'
            bat 'npm ci'
            bat 'npm i -D @playwright/test'
            bat 'npx playwright test'
            bat 'npx playwright show-report'
         }
      }
   }
}