pipeline {
    agent {
        label 'devops-final-try'
    }

    stages {
        stage("Build") {
            steps {
                script {
                    def version=readJSON(file: 'package.json').version
                    echo "${version}"
                    echo "${env.BUILD_NUMBER}"
                    echo "${env.BRANCH_NAME}"
                }
            }
        }
    }
}