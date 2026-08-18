# Setup Guide

## Overview

This document describes how to configure and run the Finance AI project for local development.

The project is composed of three main services:

- Backend (Spring Boot)
- Frontend (React)
- Machine Learning Service (FastAPI)

The application persists data in an Oracle Database hosted on Oracle Cloud Infrastructure (OCI).

Docker is the **official and recommended** way to run the application.

---

# Prerequisites

Install the following software before starting.

| Software       | Version |
|----------------|---------|
| Git            | Latest  |
| Docker Desktop | Latest  |
| Docker Compose | Latest  |

> Java, Maven and Python are only required if you intend to develop individual modules outside Docker.

Verify your installation:

```
docker --version

docker compose version

git --version
```

---

# Clone the Repository

```
git clone https://github.com/<organization>/smart-finance-ai-g9-team-11.git

cd smart-finance-ai-g9-team-11
```

---

# Project Structure

```
smart-finance-ai-g9-team-11/

├── backend/
│   └── Dockerfile
│
├── frontend/
│   └── Dockerfile
│
├── ml/
│   └── Dockerfile
│
├── docs/
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md
```

---

# Docker Architecture

```
                    Docker Network

        ┌────────────────────────────┐
        │         Frontend           │
        └──────────────┬─────────────┘
                       │
                       ▼
        ┌────────────────────────────┐
        │     Spring Boot Backend    │
        └──────────────┬─────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
 ┌─────────────────┐      ┌────────────────────┐
 │ FastAPI Service │      │ Oracle Database    │
 │ Machine Learning│      │ Oracle Cloud (OCI) │
 └─────────────────┘      └────────────────────┘
```

The backend communicates with:

- Oracle Database (persistent storage)
- FastAPI (Machine Learning predictions)

The frontend communicates only with the backend.

---

# Environment Variables

Create a `.env` file in the project root using `.env.example` as reference.

Example:

```properties
DB_URL=

DB_USERNAME=

DB_PASSWORD=

SPRING_PROFILES_ACTIVE=docker

ML_API_URL=http://ml-service:8000
```

Description:

| Variable               | Description                  |
|------------------------|------------------------------|
| DB_URL                 | Oracle JDBC connection URL   |
| DB_USERNAME            | Oracle username              |
| DB_PASSWORD            | Oracle password              |
| SPRING_PROFILES_ACTIVE | Spring profile               |
| ML_API_URL             | Machine Learning service URL |

---

# Running the Application

Build all containers.

```
docker compose build
```

Start all services.

```
docker compose up
```

Run in detached mode.

```
docker compose up -d
```

---

# Available Services

After startup, the services will be available at:

| Service      | URL                                         |
|--------------|---------------------------------------------|
| Backend      | http://localhost:8080                       |
| Swagger      | http://localhost:8080/swagger-ui/index.html |
| Frontend     | http://localhost:3000                       |
| FastAPI      | http://localhost:8000                       |
| FastAPI Docs | http://localhost:8000/docs                  |

---

# Docker Commands

Build containers

```
docker compose build
```

Start containers

```
docker compose up
```

Start in background

```
docker compose up -d
```

Stop containers

```
docker compose down
```

Rebuild containers

```
docker compose up --build
```

View all logs

```
docker compose logs
```

View backend logs

```
docker compose logs backend-service
```

View ML logs

```
docker compose logs ml-service
```

Restart a service

```
docker compose restart backend-service
```

---

# Database Configuration

The project uses Oracle Database.

Database schema versioning is managed by Flyway.

Migration files are located at:

```
backend/src/main/resources/db/migration
```

Migration naming convention:

```
V1__create_initial_schema.sql

V2__create_indexes.sql

V3__add_new_columns.sql
```

Flyway automatically executes pending migrations during application startup.

---

# Machine Learning Integration

The backend communicates with the Machine Learning service through HTTP.

Communication flow:

```
FinancialAnalysisService

        │

        ▼

MlServiceClient

        │

        ▼

POST /analise-financeira

        │

        ▼

FastAPI

        │

        ▼

Machine Learning Model
```

The FastAPI service is responsible for:

- Transaction classification
- Financial profile prediction
- Spending summary generation
- Personalized recommendations


---

# Common Issues

## Docker daemon is not running

Start Docker Desktop before executing any Docker commands.

---

## Backend cannot connect to Oracle Database

Verify:

- Database credentials
- Oracle instance availability
- Network access
- JDBC URL

---

## FastAPI unavailable

Check whether the ML container is running.

```
docker compose ps
```

---

## Flyway migration failed

Check the migration history table and ensure migration versions are unique.

---

## Environment variables not loaded

Verify that the `.env` file exists in the project root and contains the required variables.

---

# Development Workflow

1. Clone the repository.
2. Create a branch from `develop`.
3. Implement the feature.
4. Test locally using Docker.
5. Commit your changes.
6. Open a Pull Request.

---

# Additional Documentation

For more information about the project, refer to:

- ARCHITECTURE.md
- API.md
- DATABASE.md
- BUSINESS_RULES.md
- CONTRIBUTING.md