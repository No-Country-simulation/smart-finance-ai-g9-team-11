# Database Documentation

## Overview

The Finance AI platform uses **Oracle Database** as its primary relational database.

Database schema versioning is managed using **Flyway**, ensuring that every structural change is tracked through versioned SQL migrations.

---

# Technologies

| Technology      | Description                           |
|-----------------|---------------------------------------|O banco de dados oficial do projeto foi alterado para **MySQL**.

Abaixo está a documentação atualizada refletindo essa mudança tecnológica, mantendo a estrutura e o nível de detalhes do documento anterior:

---

# Database Documentation

## Overview

The Finance AI platform uses **MySQL** as its primary relational database.

Database schema versioning is managed using **Flyway**, ensuring that every structural change is tracked through versioned SQL migrations.

---

# Technologies

| Technology      | Description                           |
|-----------------|---------------------------------------|
| MySQL           | Relational Database Management System |
| Spring Data JPA | ORM framework                         |
| Hibernate       | JPA implementation                    |
| Flyway          | Database schema versioning            |

---

# Database Architecture

```
 Spring Boot

      │

      ▼

Spring Data JPA

      │

      ▼

  Hibernate

      │

      ▼

    MySQL

```

---

# Entity Relationship Diagram

```
                  +---------------------------+
                  |          AppUser          |
                  +---------------------------+
                  | id                        |
                  | nome                      |
                  | email                     |
                  | senha                     |
                  | ativo                     |
                  +-------------+-------------+
                                |
                                | 1
                                |
                                | N
                                ▼
+---------------------------+       +---------------------------+
|    Financial Analysis     |       |        Transaction        |
+---------------------------+       +---------------------------+
| id                        |       | id                        |
| usuario_id (FK)           |       | descricao                 |
| perfil_financeiro         |       | valor                     |
| nivel_endividamento       |       | tipo                      |
| frequencia_poupanca       |       | categoria                 |
| probabilidade             |       | data                      |
| data_analise              |       | origem                    |
| origem                    |       | usuario_id (FK)           |
+---------------------------+       +---------------------------+

```

---

# Tables

## app_user

Stores user accounts and credentials, supporting account status management via soft delete.

| Column | Type         | Description                       |
|--------|--------------|-----------------------------------|
| id     | BIGINT       | Primary Key (Auto Increment)      |
| nome   | VARCHAR(255) | User full name                    |
| email  | VARCHAR(255) | User email (unique)               |
| senha  | VARCHAR(255) | Encrypted password hash           |
| ativo  | BOOLEAN      | Account status flag (Soft Delete) |

---

## financial_analysis

Stores the result of each financial analysis performed or triggered by the user, distinguishing between AI and local fallback origins.

| Column              | Type         | Description                               |
|---------------------|--------------|-------------------------------------------|
| id                  | BIGINT       | Primary Key (Auto Increment)              |
| usuario_id          | BIGINT       | Foreign Key to `usuario`                  |
| perfil_financeiro   | VARCHAR(50)  | Financial profile predicted or calculated |
| nivel_endividamento | DECIMAL(5,2) | Debt level percentage                     |
| frequencia_poupanca | VARCHAR(50)  | Saving frequency                          |
| probabilidade       | DECIMAL(5,2) | Prediction confidence                     |
| data_analise        | DATE         | Analysis date                             |
| origem              | VARCHAR(50)  | Source origin (`ML` or `FALLBACK`)        |

---

## transactions

Stores all financial transactions registered by the user.

| Column     | Type          | Description                                |
|------------|---------------|--------------------------------------------|
| id         | BIGINT        | Primary Key (Auto Increment)               |
| descricao  | VARCHAR(255)  | Transaction description                    |
| valor      | DECIMAL(10,2) | Transaction amount                         |
| tipo       | VARCHAR(50)   | Transaction type (`RECEITA` or `DESPESA`)  |
| categoria  | VARCHAR(50)   | Category predicted by AI or local fallback |
| data       | DATE          | Transaction date                           |
| origem     | VARCHAR(50)   | Source origin (`ML` or `FALLBACK`)         |
| usuario_id | BIGINT        | Foreign Key to `usuario`                   |

---

# Relationships

```
AppUser

        1

        │

        ├──────────────────────────┐

        ▼                          ▼

FinancialAnalysis           Transaction

        N                          N

```

One user may have multiple financial analyses and multiple transactions.

Each financial analysis and transaction belongs to a single user.

---

# Enumerations

The application stores Java Enums as strings in the database.

---

## SavingFrequency

```
BAIXA

MEDIA

ALTA

```

---

## FinancialProfile

```
SAUDAVEL

EM_OBSERVACAO

EM_RISCO

```

---

## TransactionType

```
RECEITA

DESPESA

```

---

## Source

```
ML

FALLBACK

```

---

## TransactionCategory

```
ALIMENTACAO

MORADIA

UTILITARIOS

INVESTIMENTO

COMPRAS

SAUDE

ENTRETENIMENTO

TRAJETO

SALARIO

OUTROS

```

---

# Primary Keys

Every table uses a surrogate primary key.

Example:

```
id BIGINT AUTO_INCREMENT

```

Generated by JPA/MySQL.

---

# Foreign Keys

Financial Analysis

```
usuario_id

↓

usuario.id

```

Transaction

```
usuario_id

↓

usuario.id

```

These relationships guarantee referential integrity and data isolation per user.

---

# Indexes

Recommended and implemented indexes to optimize multi-tenant lookups, periods, and ownership filtering:

App User

```
email

```

Financial Analysis

```
usuario_id

data_analise

```

Transaction

```
usuario_id

data

usuario_id, data

```

---

# Flyway

The project uses Flyway for schema versioning.

Migration files are located at:

```
backend/src/main/resources/db/migration

```

Every database modification must be implemented through a new migration.

Existing migrations must never be modified after being applied.

---

# Naming Conventions

## Tables

Plural or singular form based on domain entities mapped in Spring Data JPA.

---

## Columns

Snake case.

Example

```
perfil_financeiro

nivel_endividamento

usuario_id

```

---

## Primary Keys

```
id

```

---

## Foreign Keys

```
usuario_id

```

---

# Data Integrity

The application relies on Bean Validation and domain service rules before persisting data.

Examples:

* Account emails must be unique.
* Transactions have a strict 30-day editable/deletable window constraint.
* Duplicate transaction checks occur prior to insertion based on user, description, value, and date.
* Required fields cannot be null.

Database constraints complement application-level validation.

---

# Persistence Flow

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

    MySQL

```

The Repository layer is solely responsible for data persistence.

---

# Backup Strategy

Production environments should rely on standard MySQL backup mechanisms (such as mysqldump or cloud-managed database snapshots).

Local development databases may be recreated using Flyway migrations.

---

# Future Database Evolution

The following features or capabilities are planned for future versions:

* Financial goals tracking
* Extended budgeting features
* Advanced investment suggestions
* Automatic debt-level calculations
* Audit logging for administrative activities

---

# Design Decisions

* MySQL is the official relational database.
* Flyway is mandatory for schema evolution.
* Spring Data JPA is the persistence layer.
* Hibernate is the JPA implementation.
* Java Enums are persisted as strings for better readability.
* Recommendations are **not persisted** in the current version.
* Transaction categorization and analysis generation support both active ML integration and graceful local fallbacks (`FALLBACK`), recorded via source tracking flags.
| Oracle Database | Relational Database Management System |
| Spring Data JPA | ORM framework                         |
| Hibernate       | JPA implementation                    |
| Flyway          | Database schema versioning            |