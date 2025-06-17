String IMAGE_TAG

pipeline {
    agent {
        label 'devops-final-try'
    }

    stages {
        stage("Build") {
            steps {
                script {
                    def version = readJSON(file: 'package.json').version

                    if(env.BRANCH_NAME == 'master') {
                        IMAGE_TAG = version
                    } else {
                        IMAGE_TAG = env.BUILD_NUMBER
                    }

                    echo "${IMAGE_TAG}"
                }
            }
        }
    }
}