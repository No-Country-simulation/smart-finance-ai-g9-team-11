# smart-finance-ai-g9-team-11

AI-powered financial health analysis platform built with Spring Boot, React, Python, MySQL, Docker and Oracle Cloud Infrastructure (OCI).

# 💰 FinanceAI

FinanceAI is an intelligent financial health analysis platform developed during the Oracle Next Education (ONE) Hackathon.

The application helps users understand their financial behavior by registering transactions, automatically classifying expenses, generating financial profile analyses and providing personalized recommendations.

---

## 🚀 Features

- User registration and login
- JWT authentication
- Automatic transaction classification
- Financial profile analysis
- Spending summary by category
- Personalized financial recommendations
- Financial analysis history
- REST API
- Machine Learning integration
- Swagger/OpenAPI documentation
- Docker environment
- Oracle Cloud Infrastructure (OCI) deployment validation

---

## 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Spring Validation
- Maven
- SpringDoc OpenAPI (Swagger)

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router
- React Hook Form
- Zod
- Recharts

### Machine Learning

- Python
- FastAPI
- Pandas
- NumPy
- Scikit-Learn
- Joblib

### Database

- MySQL

### Cloud / Infrastructure

- Docker
- Docker Compose
- Oracle Cloud Infrastructure (OCI Compute)

### DevOps

- Git
- GitHub
- GitHub Projects

---

## 📂 Project Structure

```text
.
├── backend/
│   └── Java Spring Boot REST API
├── frontend/
│   └── React application
├── ml/
│   └── FastAPI Machine Learning service
├── docs/
│   └── Project documentation
├── docker-compose.yml
└── README.md
```

---

## 🏗 Architecture

```text
React Frontend
      ↓
Spring Boot REST API
      ↓
MySQL Database
      ↓
FastAPI / Machine Learning Service
```

The backend acts as the central layer of the application, responsible for authentication, data validation, business rules, persistence and communication between the frontend, database and Machine Learning service.

---

## 🔄 Application Flow

### Transaction registration and classification

```text
Authenticated user
        ↓
Frontend sends the transaction
        ↓
Backend validates the data and identifies the user
        ↓
Backend sends the transaction to the Machine Learning service
        ↓
ML service returns the transaction category
        ↓
Backend saves the categorized transaction in MySQL
        ↓
Frontend displays the classified transaction
```

### Financial analysis

```text
User provides start date and end date
        ↓
Frontend sends the date range to the backend
        ↓
Backend validates the dates
        ↓
Backend retrieves the user's categorized transactions from MySQL
        ↓
Backend sends the transactions to the Machine Learning service
        ↓
ML service generates the financial profile, spending summary and recommendations
        ↓
Backend saves and returns the analysis
        ↓
Frontend displays the result to the user
```

---

## 📌 Main Endpoints

### Authentication

```text
POST /auth/login
```

### Users

```text
POST /users
GET  /users/me
```

### Transactions

```text
GET    /classificar-transacoes
POST   /classificar-transacoes
POST   /classificar-transacoes/batch
PUT    /classificar-transacoes/{id}
DELETE /classificar-transacoes/{id}
```

### Financial Analysis

```text
POST   /analise-financeira
GET    /analise-financeira
GET    /analise-financeira/{id}
DELETE /analise-financeira/{id}
```

---

## 📦 Request Examples

### Create Transaction

```http
POST /classificar-transacoes
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "descricao": "Mercado Extra",
  "valor": 320.50,
  "tipo": "Despesa",
  "data": "2026-08-02"
}
```

The transaction is sent to the Machine Learning service for automatic category classification before being saved in the database.

---

### List Transactions by Date Range

```http
GET /classificar-transacoes?dataInicial=2026-08-01&dataFinal=2026-08-31
Authorization: Bearer {token}
```

If no date filter is provided, the endpoint returns all transactions that belong to the authenticated user.

---

### Generate Financial Analysis

```http
POST /analise-financeira
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "data_inicial": "2026-08-01",
  "data_final": "2026-08-31"
}
```

The backend retrieves the user's categorized transactions within the selected period and sends them to the Machine Learning service to generate the financial profile, spending summary and recommendations.

---

## 📄 API Documentation

When running the backend locally, the Swagger documentation is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

The OpenAPI specification is available at:

```text
http://localhost:8080/v3/api-docs
```

---

## ▶️ Running the Project with Docker

From the project root, run:

```bash
docker compose up -d --build
```

If you are using the older Docker Compose version, run:

```bash
docker-compose up -d --build
```

To check the running containers:

```bash
docker compose ps
```

or:

```bash
docker-compose ps
```

---

## 🌐 Local URLs

After starting the services, access:

```text
Frontend:
http://localhost

Backend / Swagger:
http://localhost:8080/swagger-ui/index.html

FastAPI / Machine Learning:
http://localhost:8000/docs
```

---

## 💻 Running the Frontend Locally

If needed, the frontend can also be executed locally:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The `.env` file must contain:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🗄 Database

The project uses MySQL for data persistence.

When running with Docker Compose, the backend must connect to the database using the Docker service name, for example:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/finance_ai
```

Inside Docker, the backend should not use `localhost` to access the database, because `localhost` refers to the backend container itself.

---

## ✅ Tests

Manual and automated tests were performed to validate the main backend flows.

### Manual Tests

- Authentication
- User registration
- Transaction registration
- Transaction classification
- Financial analysis generation
- API response validation
- Integration with the Machine Learning service
- Validation through Swagger/OpenAPI
- Local Docker environment validation

### Automated Tests

Automated tests were created for important backend services, including:

- Transaction classification
- Financial profile generation
- Financial analysis
- User operations

Automated test result:

```text
24 tests executed
0 failures
0 errors
1 skipped test
```

---

## 📊 Project Status

```text
Backend: functional
Machine Learning: functional
Frontend: main integration functional
Local database: functional
Local Docker environment: functional
OCI deployment: under validation
```

### Deployment Note

The project is configured to run with Docker and to be deployed using Oracle Cloud Infrastructure Compute.

The local environment is functional with frontend, backend, database and Machine Learning service. The OCI deployment is currently under validation, mainly regarding the connection between the backend and the database in the cloud environment.

---

## 👨‍💻 Team

Developed by Team FinanceAI during the Oracle Next Education Hackathon.

| Member | Area | Responsibilities |
|--------|------|------------------|
| Gabriel | Backend | Services, business rules, ML integration, database and Docker |
| Amanda | Backend | REST controllers, Swagger/OpenAPI documentation, API validation and tests |
| Leilanny | Backend | DTOs, validations, user CRUD and JWT authentication |
| Fred | Backend | Contribution to the financial analysis CRUD |
| Gean | Frontend | React interface, UI/UX and API integration |
| Luciano | Machine Learning | Model training, preprocessing and recommendations |
| Vitor | Machine Learning | FastAPI service, model deployment and inference |

---

## 📅 Roadmap

- [x] Project planning
- [x] Backend API
- [x] Machine Learning service
- [x] Frontend main flow
- [x] API documentation
- [x] Local Docker environment
- [x] Backend tests
- [ ] Final OCI deployment validation
- [ ] Complete frontend integration improvements
- [ ] Demo Day

---

## 🔜 Next Steps

- Finalize OCI deployment validation.
- Improve the complete frontend integration.
- Adjust the display of financial recommendations.
- Improve the dashboard user experience.
- Add CSV transaction import.
- Expand automated tests.
- Improve deployment documentation.

---

## 📄 License

This project is licensed under the MIT License.