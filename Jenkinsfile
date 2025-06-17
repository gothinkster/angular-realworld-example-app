String FIRST_IMAGE_TAG
String SECOND_IMAGE_TAG

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
                        FIRST_IMAGE_TAG = version
                    } else if(env.BRANCH_NAME.startsWith('release')) {
                        FIRST_IMAGE_TAG = "latest-dev"
                        SECOND_IMAGE_TAG = "release-${env.BUILD_NUMBER}"
                    } else {
                        FIRST_IMAGE_TAG = env.BUILD_NUMBER
                    }

                    echo "${FIRST_IMAGE_TAG}"
                    echo "${SECOND_IMAGE_TAG}"
                }
            }
        }
    }
}