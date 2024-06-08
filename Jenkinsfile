pipeline {
   agent any
   stages {
      stage('e2e-tests') {
=        steps {
                deleteDir()
         }

         steps {
            bat 'npx playwright install'
            bat 'npm i -D @playwright/test'
            bat 'npx playwright test'
         }
      }
   }
}