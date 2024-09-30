# Backend Node.js Application with MongoDB, Secure CI/CD Pipeline, and Cloud Deployment

## **Overview**

This project is a comprehensive backend API built with **Node.js** and **MongoDB**, showcasing a modern development workflow. The project includes:

- **CRUD operations** with MongoDB (local and Atlas)
- **Mongoose schema validation** for data integrity
- **JWT-based authentication** for securing API endpoints
- A **Dockerized application** with multi-stage builds
- **CI/CD pipeline** setup using **Jenkins**, **Docker**, and **DigitalOcean**
- Secure credential management using **Jenkins**
- **Integration and unit tests** using **Mocha**, **Chai**, and **Supertest**
- Cloud deployment to **DigitalOcean**

## **Table of Contents**

- [Backend Node.js Application with MongoDB, Secure CI/CD Pipeline, and Cloud Deployment](#backend-nodejs-application-with-mongodb-secure-cicd-pipeline-and-cloud-deployment)
  - [**Overview**](#overview)
  - [**Table of Contents**](#table-of-contents)
  - [**Tech Stack**](#tech-stack)
  - [**Project Structure**](#project-structure)
  - [**Features**](#features)
  - [**Getting Started**](#getting-started)
    - [**Prerequisites**](#prerequisites)
    - [**Installation**](#installation)
  - [**MongoDB Configuration**](#mongodb-configuration)
    - [**Local MongoDB Setup**](#local-mongodb-setup)
    - [**MongoDB Atlas Setup**](#mongodb-atlas-setup)
  - [**Docker Setup**](#docker-setup)
    - [**Building and Running with Docker**](#building-and-running-with-docker)
  - [**Jenkins CI/CD Pipeline**](#jenkins-cicd-pipeline)
    - [**Pipeline Setup**](#pipeline-setup)
  - [**Testing**](#testing)
    - [**Run Tests**](#run-tests)
    - [**Run Tests with Coverage**](#run-tests-with-coverage)
  - [**Security and Logging**](#security-and-logging)
  - [**Future Improvements**](#future-improvements)
  - [**Project Roadmap**](#project-roadmap)
  - [**Contributing**](#contributing)
  - [**Conclusion**](#conclusion)
  - [**Authors**](#authors)
  - [LICENSE](#license)

## **Tech Stack**

- **Node.js** with **Express.js** (Backend)
- **MongoDB** (Database) - Local and Atlas
- **Mongoose** (ODM for MongoDB)
- **JWT** (Authentication)
- **Docker** (Containerization)
- **Jenkins** (CI/CD Pipeline)
- **DigitalOcean** (Cloud Deployment)
- **Mocha**, **Chai**, and **Supertest** (Testing)

## **Project Structure**

```markdown
backend-app/
│
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── Jenkinsfile-test
├── swagger.js
├── .env
├── app.js
├── server.js
├── controllers/
│   └── itemController.js
├── middleware/
│   └── auth.js
│   └── error.js
│   └── validation.js
├── models/
│   └── Items.js
│   └── User.js
├── routes/
│   └── items.js
│   └── auth.js
├── test/
│   └── integration/
│       └── items.test.js
│       └── app.test.js
│   └── unit/
│       └── itemController.test.js
├── package.json
├── package-lock.json
├── config/
│   └── db.js
│   └── validationEnv.js
├── utils/
│   └── logger.js
├── node_modules/
├── .gitignore
├── .dockerignore
├── .eslintrc.json
├── .eslintignore
├── .babelrc
├── LICENCE
└── README.md
```

## **Features**

- **CRUD API**: Full Create, Read, Update, Delete operations for MongoDB collections.
- **Authentication**: JWT-based secure endpoints.
- **Mongoose Validation**: Schema-based data validation.
- **Dockerized**: Deployed via Docker for development and production.
- **CI/CD**: Continuous Integration/Deployment pipeline using Jenkins.
- **Cloud Deployment**: Hosted on DigitalOcean Droplets.

## **Getting Started**

### **Prerequisites**

- **Node.js v16+** installed
- **Docker** installed
- **Jenkins** set up for CI/CD
- **MongoDB** (Local or MongoDB Atlas)
- **GitHub** repository for source control

### **Installation**

1. Clone the repository:

```bash
git clone https://github.com/your-repo/backend-app.git
cd backend-app
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env` file:

```bash
touch .env
```

- Add the following variables:

```env
MONGO_URI=mongodb://localhost:27017/backend-app
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

4. Start the app locally:

```bash
npm start
```

## **MongoDB Configuration**

### **Local MongoDB Setup**

If using local MongoDB, ensure that MongoDB is installed and running. The default `.env` file will connect to `mongodb://localhost:27017/backend-app`.

### **MongoDB Atlas Setup**

1. Sign up and create a MongoDB Atlas cluster.
2. Whitelist your IP address.
3. Get the MongoDB connection string and replace it in your `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/backend-app?retryWrites=true&w=majority
```

4. Use this updated connection string for production.

## **Docker Setup**

This project is fully dockerized using the **Dockerfile** and **docker-compose.yml** for a multi-container setup.

### **Building and Running with Docker**

1. Build and run the application using Docker:

```bash
    docker-compose up --build
```

2. This will create two containers:
    - **app**: The Node.js application container.
    - **mongo**: The MongoDB container.

The application will be available on `http://localhost:3000`.

## **Jenkins CI/CD Pipeline**

The CI/CD pipeline automates testing, building, and deploying the application using **Jenkins**, **Docker**, and **DigitalOcean**.

### **Pipeline Setup**

1. Install Jenkins on your local machine or a cloud VM (DigitalOcean, AWS, etc.).
2. Create a **Jenkinsfile** in the root of your project (already provided):

```groovy
    pipeline {
        agent any

        environment {
            DOCKER_USERNAME = credentials('docker-hub-credentials').username
            DOCKER_PASSWORD = credentials('docker-hub-credentials').password
            DIGITALOCEAN_TOKEN = credentials('do-api-token')
        }

        stages {
            stage('Checkout') {
                steps {
                    git branch: 'main', credentialsId: 'github-token', url: 'https://github.com/your-repo/backend-app.git'
                }
            }

            stage('Build Docker Image') {
                steps {
                    script {
                        sh 'docker build -t your-username/backend-app .'
                    }
                }
            }

            stage('Push Docker Image') {
                steps {
                    script {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                        sh 'docker push your-username/backend-app'
                    }
                }
            }

            stage('Deploy to DigitalOcean') {
                steps {
                    script {
                        sh 'curl -X POST -H "Authorization: Bearer $DIGITALOCEAN_TOKEN" https://api.digitalocean.com/v2/droplets'
                    }
                }
            }
        }
    }
```

3. Configure credentials for GitHub, Docker Hub, and DigitalOcean in Jenkins:
    - Go to **Jenkins Dashboard > Manage Jenkins > Manage Credentials**.
    - Add your **GitHub Token**, **Docker Hub Credentials**, and **DigitalOcean API Token**.

4. Run the pipeline to automatically build and deploy your application to DigitalOcean:

- [x] **Key Jenkinsfile Stages**
  - [ ] **Build**: Build the Node.js app and Docker image
  - [ ] **Test**: Run Mocha tests and generate reports
  - [ ] **Deploy**: Deploy to production server
- [x] **Running the Pipeline**
  - [ ] **Push** to GitHub triggers Jenkins pipeline
  - [ ] **Monitor** the build process via Jenkins GUI

## **Testing**

Testing is done using **Mocha**, **Chai**, and **Supertest** for integration and unit testing.

### **Run Tests**

```bash
npm test
```

### **Run Tests with Coverage**

To check coverage:
1. Install `nyc`:

```bash
npm install --save-dev nyc
```

2. Run:

```bash
npm run coverage
```

1. View the coverage report generated in the `coverage/` folder.

## **Security and Logging**

1. **Authentication**: Secure API endpoints with **JWT**.
    - Add token-based authentication using `jsonwebtoken`.
    - Middleware ensures that requests to protected routes contain a valid token.

2. **Environment Variables**: Sensitive data like API keys and tokens are stored in a `.env` file and managed securely in Jenkins using credentials.

3. **Logging**: Add structured logging using **Winston**.

4. **Rate Limiting**: Protect the application from brute-force attacks with **express-rate-limit**.

5. **Error Handling**: Centralized error handling in `app.js` catches and responds to errors gracefully.

## **Future Improvements**

- Add **frontend** integration to make this a full-stack project.
- Implement **real-time features** with **WebSockets**.
- Automate scaling using Kubernetes and Docker Swarm.
- Enhance security with **OAuth2.0** authentication for 3rd-party APIs.
- Monitor application performance with **Prometheus** and **Grafana**.

---

## **Project Roadmap**

- [x] **Project Setup**: Initialize the project with Node.js, Express, and MongoDB.
- [ ] **CRUD Operations**: Implement full CRUD operations with MongoDB.
- [ ] **Authentication**: Secure API endpoints with JWT-based authentication.
- [ ] **Security and Logging**: Implement secure practices and structured logging.
- [ ] **Testing**: Write integration and unit tests for the application.
- [ ] **Docker Setup**: Dockerize the application for development and production.
- [ ] **Cloud Deployment**: Deploy the application to cloud server(AWS, AZURE, DigitalOcean).
- [ ] **CI/CD Pipeline**: Set up a Jenkins pipeline for automated testing and deployment.
- [ ] **Documentation**: Write a detailed README and project documentation.
- [ ] **Future Improvements**: Plan for future enhancements and features.
- [ ] **Conclusion**: Wrap up the project with a conclusion and final thoughts.

---

## **Contributing**

Contributions are welcome! Here's how you can contribute to this project:

- Fork the repository
- Create a new branch (`git checkout -b feature-branch`)
- Make your changes
- Commit your changes (`git commit -am 'Add new feature'`)
- Push to the branch (`git push origin feature-branch`)
- Create a new Pull Request
- Make sure your code lints (`npm run lint`) and tests pass (`npm test`)
- Issue a PR with a detailed description of your changes
- Wait for your PR review and merge approval!
- Star this repository if you had fun!
- Check out the [Contributing Guidelines](./CONTRIBUTING.md) for more details.

---

## **Conclusion**

This project demonstrates a secure and scalable Node.js backend with MongoDB, Dockerized for development and production, and deployed with an automated CI/CD pipeline. It includes thorough validation, testing, and deployment, making it a great showcase for modern backend development and DevOps practices.

---

## **Authors**

- **Name**: [Idowu Olayiwola Bamidele](https://github.com/Bamidele0102) || [Victor Amajuoyi](https://github.com/hegavon)

---

## LICENSE

This project is licensed under the [Apache License](./LICENSE).
