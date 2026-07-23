# System Architecture

## Overview

**Finance AI** is an intelligent financial analysis platform designed to evaluate a user's financial behavior using Artificial Intelligence.

The system receives financial information provided by the user, processes it through a Machine Learning service, and returns a financial assessment containing the user's financial profile, a categorized spending summary, and personalized recommendations.

The application follows a layered architecture, separating responsibilities between presentation, business logic, data persistence, and external service integration.

---

# Overall Architecture

```text
                        ┌──────────────────────┐
                        │      Frontend        │
                        └──────────┬───────────┘
                                   │ HTTP/JSON
                                   ▼
                 ┌────────────────────────────────┐
                 │ FinancialAnalysisController    │
                 └───────────────┬────────────────┘
                                 │
                                 ▼
                 ┌────────────────────────────────┐
                 │ FinancialAnalysisService       │
                 └───────┬─────────────────┬──────┘
                         │                 │
                         │                 │
                         ▼                 ▼
          ┌────────────────────┐   ┌─────────────────────┐
          │ Oracle Database    │   │   MlServiceClient   │
          └────────────────────┘   └──────────┬──────────┘
                                              │ HTTP/JSON
                                              ▼
                                   ┌────────────────────────┐
                                   │ FastAPI + Machine      │
                                   │ Learning Model         │
                                   └────────────────────────┘
```

---

# Technologies

| Layer                   | Technology            |
|-------------------------|-----------------------|
| Backend                 | Java 21 + Spring Boot |
| Persistence             | Spring Data JPA       |
| Database                | Oracle Database       |
| Database Versioning     | Flyway                |
| Artificial Intelligence | Python + FastAPI      |
| API Documentation       | Swagger / OpenAPI     |

---

# Layered Architecture

The backend follows a **Layered Architecture**, where each layer has a well-defined responsibility.

```
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

In addition to the traditional layers, the application includes an integration layer responsible for communicating with the Machine Learning API.

```
Integration
      │
      ▼
FastAPI
```

---

# Project Structure

```text
src/main/java/br/com/financeai
│
├── config
│
├── controller
│
├── dto
│   ├── request
│   └── response
│
├── entity
│
├── enums
│
├── integration
│   └── client
│
├── repository
│
├── service
│
└── FinanceAiApplication.java
```

Each package has a specific responsibility within the application.

---

# Layer Descriptions

## Controller

The Controller layer exposes the application's REST endpoints.

Responsibilities include:

- Receiving HTTP requests;
- Validating incoming data;
- Delegating processing to the Service layer;
- Returning HTTP responses.

The Controller must not contain business logic.

---

## Service

The Service layer is the core of the application.

Its responsibilities include:

- Processing business rules;
- Coordinating the application workflow;
- Persisting data;
- Integrating with external services;
- Building response objects.

All business logic should reside in this layer.

---

## Repository

The Repository layer is responsible for data persistence using Spring Data JPA.

Responsibilities include:

- Saving entities;
- Retrieving records;
- Updating data;
- Deleting records when necessary.

No business logic should exist in this layer.

---

## Integration

The Integration layer is responsible for communication with external services.

Currently, the application integrates with a Machine Learning API built with FastAPI.

Responsibilities include:

- Sending data to the Machine Learning service;
- Receiving prediction results;
- Converting external responses into backend objects.

---

## DTO

DTOs (Data Transfer Objects) define the API contracts.

They are used for:

- Request payloads;
- Response payloads.

DTOs prevent database entities from being exposed directly to clients.

---

## Entity

Entities represent the application's persistent data model.

Each entity corresponds to a table in the Oracle Database.

The current entities are:

- FinancialAnalysis
- Transaction

---

## Enums

Enums represent fixed values used throughout the application's domain.

Currently, the following enums are available:

- SavingFrequency
- FinancialProfile
- TransactionCategory

---

# Application Flow

A financial analysis is processed as follows:

1. The client submits a financial analysis request.

2. The Controller receives and validates the request.

3. The Service layer processes the request.

4. The analysis is persisted in the database.

5. The required data is sent to the Machine Learning service.

6. The Machine Learning model:

    - Classifies the transactions;
    - Predicts the financial profile;
    - Calculates the prediction confidence;
    - Generates personalized financial recommendations.

7. The backend receives the prediction result.

8. The analysis is updated with the generated information.

9. The response is returned to the client.

---

# Backend–Machine Learning Communication

The Spring Boot application communicates with the FastAPI service through HTTP requests using JSON.

Communication flow:

```
Spring Boot
      │
      │ POST /analise-financeira
      ▼
FastAPI
      │
      ▼
Machine Learning Model
      │
      ▼
JSON Response
      │
      ▼
Spring Boot
```

This separation allows the Machine Learning model to evolve independently from the backend.

---

# Data Persistence

Application data is stored in an Oracle Database.

Database schema versioning is managed with Flyway.

All structural database changes must be implemented through Flyway migrations.

Manual modifications to the database schema are discouraged.

---

# Design Principles

The application was designed following the principles below:

- Separation of Concerns;
- Low Coupling;
- High Cohesion;
- Layered Architecture;
- Code Reusability;
- Maintainability;
- Testability.

---

# Future Improvements

The architecture has been designed to support future enhancements, including:

- User authentication;
- Financial analysis history;
- Dashboard and analytics;
- Multiple Machine Learning models;
- Integration with external financial services;
- Recommendation persistence;
- Monitoring and observability.