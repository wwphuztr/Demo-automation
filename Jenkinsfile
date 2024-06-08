pipeline {
   agent any
   stages {
      stage('e2e-tests') {
         steps {
                script {
                    deleteDir() // Clean up workspace
                }
         }

         steps {
            bat 'npm i'
            bat 'npx playwright install'
            bat 'npm ci'
            bat 'npm i -D @playwright/test'
            bat 'npx playwright test'
         }
      }
   }
}