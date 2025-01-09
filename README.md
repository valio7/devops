# DevOps Project

A DevOps project built over a simple node js app. It uses multiple yml files in composition to make a complete CI/CD DevOps project.

## [sast-scan.yml](.github/workflows/sast-scan.yml)

This yml file contains the SAST scan of the project. It uses SNYK as a code analysis tool which finds vulnerabilities and other security hotspots. In the repository there is a defined secret SNYK_SECRET, which is the token used for authentication. The workflow contains a job which has 2 steps. This job is run on every push to any branch and also when it is called by another workflow.

- actions/checkout@v4 - Checkouts the repository.
- snyk/actions/node@master - Uses the snyk github action which automatically scans the code and if a vulnerability is found, the pipeline will not succeed.

## [quality-assurance.yml](.github/workflows/quality-assurance.yml)
This yml file is responsible for setting up a quality gate. This quality gate should be passed in order for the project to be SDLC compliant. This workflow can be used in any yml by just calling it and passing the SONAR_TOKEN secret, which is defined in the github repository. This token is needed for authenticating in Sonar. The job contains multiple steps to ensure quality:

- actions/checkout@v4 - Checkouts the repository.
- actions/setup-node@v4 - Sets up the node environment.
- npm install - Install the dependencies.
- npm run test - Runs the tests.
- npm run lint - Runs lint.
- SonarSource/sonarqube-scan-action@v4 - Uses a github action for running sonar.

## [pull-request.yml](.github/workflows/pull-request.yml)

This yml file includes the SAST scan job defined [here](.github/workflows/sast-scan.yml). And also runs a quality assurance check. In order to merge your pull request, it should be compliant to those checks. This workflow is called on every opened pull request and also when requested by a parent workflow by specifying the SNYK_TOKEN and the SONAR_TOKEN.

- sast-scan - Runs [sast-scan](.github/workflows/sast-scan.yml).
- quality-assurance - Runs [quality-assurance](#quality-assuranceyml).

## [build-docker-image.yml](.github/workflows/build-docker-image.yml)
This workflow is responsible for building the docker image from the Dockerfile. It is triggered when it has been called by a parent workflow, specifying DOCKERHUB_USERNAME and DOCKERHUB_PASSWORD, which are kept as a secret in the github repository. It also publishes the generated docker image in dockerhub.

- actions/checkout@v4 - Checkouts the repository.
- docker/setup-buildx-action@v3 - Used to be able to build the docker image.
- docker/login-action@v3 - Authenticates in dockerhub.
- docker build -t valkata7/devops:latest . - Builds the docker image.
- docker push valkata7/devops:latest - Publishes the docker image.

## [primary.yml](.github/workflows/primary.yml)
This workflow is run on every push on develop. It contains of 2 jobs [pull-request](#pull-requestyml) and [build-docker-image](#build-docker-imageyml). The second job depends on the first one, because if the quality gate is not passed, a docker image is not being uploaded. On every successful quality gate pass, a docker image is uploaded to dockerhub in order to be easier to the developers to get the latest version of the project in a docker image.

- pull-request - Runs the pull request workflow.
- build-docker-image - Runs the build-docker-image workflow.

## [deploy](.github/workflows/deploy.yml)
This workflow contains of 2 jobs which are dependant. Firstly, the quality gate should be passed and after that, the docker image which was uploaded to dockerhub in the latest push to develop is being deployed in railway. Railway is a platform where you can deploy your project by providing it a docker image. The service options in Railway are set to always take the latest docker image from dockerhub on redeploy.

- quality-gate - Runs the [pull-request workflow](#pull-requestyml).
- deploy-docker-image - Deploys the docker image from dockerhub in railway.
