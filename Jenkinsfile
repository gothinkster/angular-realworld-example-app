def FIRST_TAG_IMAGE
def SECOND_TAG_IMAGE
String FIRST_IMAGE_TAG
String SECOND_IMAGE_TAG

pipeline {
    agent {
        label 'devops-training-yarin'
    }

    environment {
    DOCKER_REPO = 'devops-yarin'
  }

    stages {
        stage("Build") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'yarin-dockerhub', 
                                    usernameVariable: 'DOCKER_USERNAME', 
                                    passwordVariable: 'DOCKER_PASSWORD')]) {
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

                       FIRST_TAG_IMAGE = docker.build("${DOCKER_USERNAME}/${DOCKER_REPO}:${FIRST_IMAGE_TAG}")
                       SECOND_TAG_IMAGE = docker.build("${DOCKER_USERNAME}/${DOCKER_REPO}:${SECOND_IMAGE_TAG}")

                }
              }
            }
        }

        stage("Push") {
            steps {
                script { 
                    def shouldPushFirstTagImage = env.BRANCH_NAME == 'master'
                    def shouldPushSecondTagImage = SECOND_IMAGE_TAG && SECOND_IMAGE_TAG.startsWith('release') && (
                    (SECOND_IMAGE_TAG.split("-")[1] as Integer) % 4 == 0)

                    if (shouldPushFirstTagImage || shouldPushSecondTagImage) {
                        docker.withRegistry('https://index.docker.io/v1/', 'yarin-dockerhub') {
                        if (shouldPushFirstTagImage) {
                            FIRST_TAG_IMAGE.push()
                        }
                        if (shouldPushSecondTagImage) {
                            SECOND_TAG_IMAGE.push()
                        }               
                    }
                    }
                }
            }
        }

        stage("upgrade helm") {
            steps {
                script {
                    if(env.BRANCH_NAME == 'master') { // use FIRST_IMAGE_TAG
                    git(url: 'https://github.com/Yarin134/fake-helm-charts-yarin-training.git', branch: 'main')
                    sh "sed -i '/realworld:/{n;s/tag:.*/tag: ${FIRST_IMAGE_TAG}/;}' values.yaml"
                    sh 'cat values.yaml'
                    sh 'git config --global user.name "Yarin134"'
                    sh 'git config --global user.email yarindavid@gmail.com'
                    sh 'git add values.yaml'
                    sh "git commit -m 'change to tag: ${FIRST_IMAGE_TAG} '"
                    sh 'git push'
                    }
                }
            }
        }
        
    }
}