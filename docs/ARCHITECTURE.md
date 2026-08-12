# System Architecture

## Overview

**Finance AI** is an intelligent financial analysis platform designed to evaluate a user's financial behavior using Artificial Intelligence.

The system receives financial information provided by the user, processes it through a Machine Learning service, and returns a financial assessment containing the user's financial profile, a categorized spending summary, and personalized recommendations. In case the AI service is unavailable, the system features a robust fallback mechanism to ensure continuous operation.

The application follows a layered architecture, separating responsibilities between presentation, security, business logic, data persistence, and external service integration.

---

# Overall Architecture

```text
                        ┌──────────────────────┐
                        │      Frontend        │
                        └──────────┬───────────┘
                                   │ HTTP/JSON + JWT
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
          │   MySQL Database   │   │   MlServiceClient   │
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

| Layer | Technology |
| --- | --- |
| Backend | Java 21 + Spring Boot |
| Security | Spring Security + JWT |
| Persistence | Spring Data JPA |
| Database | MySQL |
| Database Versioning | Flyway |
| Infrastructure | Docker |
| Artificial Intelligence | Python + FastAPI |
| API Documentation | Swagger / OpenAPI |

---

# Layered Architecture

The backend follows a **Layered Architecture**, where each layer has a well-defined responsibility, now enhanced with security and exception handling mechanisms.

```
Security (JWT)
    │
    ▼
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
├── security
│
├── exception
│
├── integration
│   ├── dto
│   │   ├── request
│   │   └── response
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

## Security

The Security layer is responsible for application-level protection.

Responsibilities include:

* Intercepting incoming requests;
* Validating JWT (JSON Web Tokens);
* Managing user authentication and authorization.

---

## Controller

The Controller layer exposes the application's REST endpoints.

Responsibilities include:

* Receiving HTTP requests;
* Validating incoming data;
* Delegating processing to the Service layer;
* Returning HTTP responses.

The Controller must not contain business logic.

---

## Service

The Service layer is the core of the application.

Its responsibilities include:

* Processing business rules;
* Coordinating the application workflow;
* Persisting data;
* Integrating with external services;
* Executing fallback strategies (e.g., deterministic calculations when ML is unavailable);
* Building response objects.

All business logic should reside in this layer.

---

## Repository

The Repository layer is responsible for data persistence using Spring Data JPA.

Responsibilities include:

* Saving entities;
* Retrieving records;
* Updating data;
* Deleting records when necessary.

No business logic should exist in this layer.

---

## Integration

The Integration layer is responsible for communication with external services.

Currently, the application integrates with a Machine Learning API built with FastAPI. It has its own dedicated DTOs to isolate external payloads from internal application models.

Responsibilities include:

* Sending data to the Machine Learning service;
* Receiving prediction results;
* Converting external responses into backend objects.

---

## Exception

The Exception layer handles centralized error management.

Responsibilities include:

* Catching business, validation, and integration errors globally;
* Returning standardized API error responses (e.g., 400 Bad Request, 404 Not Found).

---

## DTO

DTOs (Data Transfer Objects) define the API contracts.

They are used for:

* Request payloads;
* Response payloads.

DTOs prevent database entities from being exposed directly to clients.

---

## Entity

Entities represent the application's persistent data model.

Each entity corresponds to a table in the MySQL Database.

The current entities are:

* FinancialAnalysis
* Transaction
* UserApp

---

## Enums

Enums represent fixed values used throughout the application's domain.

Currently, the following enums are available:

* SavingFrequency (includes NENHUM, BAIXA, MEDIA, ALTA)
* FinancialProfile
* TransactionCategory
* TransactionType

---

# Application Flow

A financial analysis is processed as follows:

1. The client submits a financial analysis request (authenticated via JWT).
2. The Security layer validates the token.
3. The Controller receives and validates the request payload.
4. The Service layer processes the request.
5. The analysis is persisted in the database.
6. The required data is sent to the Machine Learning service.
7. The Machine Learning model predicts the profile and generates recommendations. *(If the ML service is down, the system triggers the internal **fallback** to generate deterministic results).*
8. The backend receives the prediction result (or uses the fallback data).
9. The analysis is updated with the generated information.
10. The response is returned to the client.

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

This separation allows the Machine Learning model to evolve independently from the backend, while the fallback ensures the system remains resilient.

---

# Data Persistence

Application data is stored in a **MySQL Database**.

The environment is containerized using **Docker** for consistency across development and production.

Database schema versioning is managed with **Flyway**. All structural database changes must be implemented through Flyway migrations. Manual modifications to the database schema are strictly discouraged.

---

# Design Principles

The application was designed following the principles below:

* Separation of Concerns;
* Low Coupling;
* High Cohesion;
* Layered Architecture;
* Code Reusability;
* Maintainability;
* Testability;
* **Resilience and Fault Tolerance** (Circuit Breaking / Fallbacks).

---

# Future Improvements

The architecture has been designed to support future enhancements, including:

* CI/CD Pipelines (Continuous Integration & Continuous Deployment);
* Cloud Deployment and horizontal scaling;
* Caching strategies (e.g., Redis) to optimize repeated queries;
* Dashboard and advanced analytics for the user interface;
* Multiple Machine Learning models with A/B testing support;
* Monitoring and observability (e.g., Prometheus and Grafana).