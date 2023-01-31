stages {
    stage('Clone Repository') {
         steps {
             git 'https://github.com/Koshiz/PUSL3120-backend.git'
        }
    }

    stage('Build') {
        steps {
            sh './gradlew build'
        }
    }

    stage('Test') {
        steps {
            sh './gradlew test'
        }
    }

    stage('Deploy Backend') {
        steps {
            sh './deploy-backend.sh'
        }
    }
}

post {
    always {
        githubStatus context: 'continuous-integration/jenkins', state: 'success'
      
            githubComment message: "The backend pipeline completed successfully!"
            githubLabel labels: ['approved']

    }
}

