# Setup Guide

## Overview

This document describes how to configure and run the Finance AI project for local development.

The project is composed of three main services:

* Backend — Spring Boot
* Frontend — React
* Machine Learning Service — FastAPI

The backend is responsible for:

* User registration and authentication
* JWT-based authorization
* User management
* Financial transaction management
* Financial analysis
* Transaction classification
* Communication with the Machine Learning service
* Persistence and retrieval of application data
* Database schema versioning through Flyway

The current backend configuration uses **MySQL** as the relational database.

---

# Prerequisites

Install the following software before starting.

| Software       | Version           |
|----------------|-------------------|
| Git            | Latest            |
| Java           | 21                |
| Maven          | 3.9+              |
| MySQL          | 8.0+              |
| Docker Desktop | Latest (optional) |

The backend uses:

* Java 21
* Spring Boot 3.5.16
* Maven
* MySQL
* Flyway
* Spring Security
* JWT
* Swagger/OpenAPI

Docker is recommended when running the complete application with its associated services. Java, Maven and MySQL are required when developing or running the backend directly on the local machine.

Verify the required installations:

```bash
java -version

mvn -version

mysql --version

git --version

docker --version

docker compose version
```

---

# Clone the Repository

```bash
git clone https://github.com/<organization>/smart-finance-ai-g9-team-11.git

cd smart-finance-ai-g9-team-11
```

---

# Project Structure

The project is organized into separate modules for the backend, frontend and Machine Learning service.

```text
smart-finance-ai-g9-team-11/

├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/
│   │   │           └── migration/
│   │   ├── test/
│   │   └── Dockerfile
│   │
│   └── pom.xml
│
├── frontend/
│
├── ml/
│
├── docs/
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md
```

The backend source code is organized into the following main packages:

```text
br.com.financeai
│
├── config
├── controller
├── dto
│   ├── request
│   └── response
├── entity
├── enums
├── exception
├── integration
│   ├── client
│   └── dto
├── repository
├── security
└── service
```

---

# Backend Configuration

The backend configuration is defined in:

```text
backend/src/main/resources/application.properties
```

The application uses environment variables whenever available, with local development defaults.

Current configuration:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/finance_ai?createDatabaseIfNotExist=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}

ml.api.url=${ML_API_URL:http://localhost:8000}

api.security.token.secret=${JWT_SECRET:minha-chave-secreta-super-segura-123}
```

For production environments, sensitive values such as database credentials and the JWT secret must be provided through environment variables instead of relying on the default values.

---

# Environment Variables

Create a `.env` file in the project root using `.env.example` as a reference.

Example:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/finance_ai?createDatabaseIfNotExist=true

DB_USERNAME=root

DB_PASSWORD=root

ML_API_URL=http://localhost:8000

JWT_SECRET=your-secure-jwt-secret
```

Description:

| Variable                | Description                                         |
|-------------------------|-----------------------------------------------------|
| `SPRING_DATASOURCE_URL` | JDBC connection URL used to connect to MySQL        |
| `DB_USERNAME`           | MySQL username                                      |
| `DB_PASSWORD`           | MySQL password                                      |
| `ML_API_URL`            | Base URL of the Machine Learning service            |
| `JWT_SECRET`            | Secret key used to generate and validate JWT tokens |

> The default values in `application.properties` are intended for local development only.

---

# Database Configuration

The current backend uses **MySQL**.

Default local configuration:

```text
Host: localhost
Port: 3306
Database: finance_ai
Username: root
Password: root
```

The database name is automatically created when using the default JDBC configuration:

```text
jdbc:mysql://localhost:3306/finance_ai?createDatabaseIfNotExist=true
```

Make sure the MySQL server is running before starting the backend.

---

# Database Migrations

Database schema versioning is managed by **Flyway**.

Migration files are located at:

```text
backend/src/main/resources/db/migration/
```

The current migrations are:

```text
V1__create_tables.sql
V2__alter_nivel_endividamento.sql
V3__add_column_origem.sql
V4__add_column_origem_to_transacoes.sql
V5__fix_nivel_endividamento_precision.sql
```

Flyway automatically executes pending migrations when the application starts.

Hibernate is configured with:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

This means Hibernate validates the existing database schema instead of creating or modifying tables automatically.

### Important

Do not modify an existing Flyway migration that has already been executed in a shared database.

When changing the database schema, create a new migration using the next version:

```text
V6__description_of_change.sql
```

---

# Running the Backend Locally

Navigate to the backend directory:

```bash
cd backend
```

Build the project:

```bash
./mvnw clean install
```

On Windows:

```bash
mvnw.cmd clean install
```

Start the application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

---

# Running the Backend with Java

After building the project, the generated JAR can also be executed directly:

```bash
java -jar target/finance-ai-api-0.0.1-SNAPSHOT.jar
```

---

# Swagger / OpenAPI

The backend provides interactive API documentation through Swagger UI.

After starting the application, access:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI documentation is available at:

```text
http://localhost:8080/v3/api-docs
```

The Swagger configuration includes JWT Bearer authentication.

To test protected endpoints:

1. Register a user.
2. Authenticate using `/auth/login`.
3. Copy the JWT returned by the authentication endpoint.
4. Click **Authorize** in Swagger.
5. Enter the token using the Bearer authentication scheme.
6. Execute the protected endpoints.

The expected authentication format is:

```text
Bearer <JWT_TOKEN>
```

---

# Authentication

The backend uses **Spring Security** with JWT authentication.

Authentication endpoints are grouped under:

```text
/auth
```

### Login

```http
POST /auth/login
```

This endpoint authenticates the user and returns a JWT token.

The token must be sent in subsequent protected requests through the HTTP header:

```http
Authorization: Bearer <token>
```

### Reactivate Account

```http
POST /auth/reactivate
```

This endpoint allows a previously deactivated account to be reactivated using the user's credentials.

Authentication and registration-related endpoints are public. The remaining application endpoints require a valid JWT token.

---

# User Management

User-related endpoints are grouped under:

```text
/users
```

The current backend provides operations for:

* User registration
* Retrieving the authenticated user
* Updating the authenticated user
* Deactivating the authenticated user

The user account is deactivated instead of being permanently deleted.

A deactivated account can subsequently be reactivated through:

```http
POST /auth/reactivate
```

---

# Transaction Management

Transaction endpoints are grouped under:

```text
/classificar-transacoes
```

The backend supports:

* Creating and classifying transactions
* Batch transaction classification
* Listing transactions
* Retrieving a transaction
* Updating a transaction
* Deleting a transaction

Transactions can be classified through the Machine Learning service when automatic classification is required.

---

# Financial Analysis

Financial analysis endpoints are grouped under:

```text
/analise-financeira
```

The backend supports:

* Creating a financial analysis
* Listing the authenticated user's analyses
* Retrieving an individual analysis
* Deleting an analysis

Financial analysis data is sent to the Machine Learning service for processing.

The response may contain information such as:

* Financial profile
* Probability
* Spending summary
* Recommendations
* Financial indicators

---

# Machine Learning Integration

The backend communicates with the Machine Learning service through HTTP using Spring's `RestClient`.

The integration is implemented by:

```text
br.com.financeai.integration.client.MlClient
```

The Machine Learning service URL is configured through:

```properties
ML_API_URL=http://localhost:8000
```

The backend currently communicates with the following ML endpoints:

### Financial Analysis

```http
POST /analise-financeira
```

Used to process the user's financial information and generate the financial analysis.

### Transaction Classification

```http
POST /classificar-transacoes
```

Used to classify transactions automatically.

Communication flow:

```text
Spring Boot Backend
        │
        ▼
      MlClient
        │
        ▼
    HTTP Request
        │
        ▼
 FastAPI / ML Service
        │
        ▼
 Machine Learning Model
        │
        ▼
    ML Response
        │
        ▼
 Spring Boot Backend
```

If the Machine Learning service is unavailable or returns an invalid response, the backend handles the failure through its external-service exception handling mechanism.

---

# Running the Machine Learning Service

The backend expects the Machine Learning service to be available at:

```text
http://localhost:8000
```

When the ML service is running locally, no additional configuration is required because this is the default value of:

```properties
ML_API_URL=http://localhost:8000
```

If the ML service is running in another environment, update:

```properties
ML_API_URL=<machine-learning-service-url>
```

The FastAPI documentation is normally available at:

```text
http://localhost:8000/docs
```

---

# Docker

The project also supports Docker-based execution through the project's Docker configuration.

Before using Docker, make sure Docker Desktop is running.

Build the containers:

```bash
docker compose build
```

Start the application:

```bash
docker compose up
```

Run in detached mode:

```bash
docker compose up -d
```

Rebuild and start:

```bash
docker compose up --build
```

Stop the application:

```bash
docker compose down
```

Check running containers:

```bash
docker compose ps
```

View all logs:

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend-service
```

View ML service logs:

```bash
docker compose logs ml-service
```

Restart the backend:

```bash
docker compose restart backend-service
```

> The exact Docker service names, ports and database configuration must match the current `docker-compose.yml` in the project root.

---

# Common Issues

## MySQL connection refused

If the backend cannot connect to MySQL, verify that:

* MySQL is running.
* Port `3306` is available.
* The database credentials are correct.
* `SPRING_DATASOURCE_URL` points to the correct database.
* The `finance_ai` database can be created by the configured user.

Example:

```text
jdbc:mysql://localhost:3306/finance_ai?createDatabaseIfNotExist=true
```

---

## Port 8080 is already in use

If another application is using port `8080`, stop the conflicting process or configure the Spring Boot application to use another port.

For example:

```properties
server.port=8081
```

---

## Machine Learning service unavailable

If financial analysis or transaction classification fails because the ML service cannot be reached, verify:

```bash
docker compose ps
```

or, when running locally:

```text
http://localhost:8000
```

Also verify the value of:

```properties
ML_API_URL
```

---

## JWT authentication fails

Verify that:

* The user credentials are correct.
* The account is active.
* The token has not expired.
* The `Authorization` header is present.
* The header follows the format:

```text
Authorization: Bearer <token>
```

Also verify that the `JWT_SECRET` value is correctly configured.

---

## Flyway migration failed

If Flyway reports a migration error:

1. Check the application logs.
2. Verify the MySQL database connection.
3. Check the Flyway history table.
4. Verify that migration versions are unique.
5. Do not modify migrations that have already been executed in a shared environment.
6. Create a new migration for subsequent schema changes.

---

## Environment variables are not loaded

Verify that:

* The `.env` file exists in the expected location.
* Variable names match those used by `application.properties`.
* The application was restarted after changing environment variables.

Important variables include:

```text
SPRING_DATASOURCE_URL
DB_USERNAME
DB_PASSWORD
ML_API_URL
JWT_SECRET
```

---

# Development Workflow

The recommended development workflow is:

1. Clone the repository.
2. Create a feature branch from `develop`.
3. Configure the required environment variables.
4. Start MySQL.
5. Start the Machine Learning service when required.
6. Run the backend.
7. Test the API using Swagger, Postman or another HTTP client.
8. Run the automated tests.
9. Implement and validate the feature.
10. Commit the changes.
11. Push the feature branch.
12. Open a Pull Request.

---

# Testing

The backend uses Spring Boot's testing infrastructure.

Tests are located at:

```text
backend/src/test/
```

Run the tests with:

```bash
./mvnw test
```

On Windows:

```bash
mvnw.cmd test
```

Before opening a Pull Request, make sure the project builds successfully and the tests pass.

---

# Additional Documentation

For more information about the project, refer to:

* `README.md`
* `ARCHITECTURE.md`
* `API.md`
* `DATABASE.md`
* `BUSINESS_RULES.md`
* `CONTRIBUTING.md`

These documents should be kept synchronized with the current implementation.
