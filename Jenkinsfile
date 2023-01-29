pipeline {
    agent any
    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/Koshiz/PUSL3120-backend.git'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Start server') {
            steps {
                sh 'npm start'
            }
        }
    }
}
