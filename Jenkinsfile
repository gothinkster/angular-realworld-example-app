pipeline {
    agent {
        label 'devops-final-try'
    }

    stages {
        stage('Build') {
            steps {
                version = readJSON(file: 'package.json').version
                echo '${version}'
                echo '${env.BUILD_NUMBER}'
            }
        }
    }
}