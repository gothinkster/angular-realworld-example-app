def FIRST_TAG_IMAGE
def SECOND_TAG_IMAGE
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

                    FIRST_TAG_IMAGE = docker.build("angular-app-devops:${FIRST_IMAGE_TAG}")
                    SECOND_TAG_IMAGE = docker.build("angular-app-devops:${SECOND_IMAGE_TAG}")
                }
            }
        }

        stage("Push") {
            steps {
                script {
                    if(env.BRANCH_NAME == 'master') {
                        withCredentials([usernamePassword(credentialsId: 'yarin-dockerhub',
                                  usernameVariable: 'DOCKER_USER',
                                  passwordVariable: 'DOCKER_PASS')]) {
                                sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                            }

                        FIRST_TAG_IMAGE.push()

                    } else if(SECOND_IMAGE_TAG.startsWith('release')) {
                        def release_number = SECOND_IMAGE_TAG.split("-")[1] as Integer
                        if(release_number % 4 == 0) {
                            withCredentials([usernamePassword(credentialsId: 'yarin-dockerhub',
                                  usernameVariable: 'DOCKER_USER',
                                  passwordVariable: 'DOCKER_PASS')]) {
                                sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                            }

                            SECOND_TAG_IMAGE.push()
                        }
                    }
                }
            }
        }
        
    }
}