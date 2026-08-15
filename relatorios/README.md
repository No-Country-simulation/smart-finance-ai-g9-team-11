# smart-finance-ai-g9-team-11
AI-powered financial health analysis platform built with Spring Boot, React, Python and Oracle Cloud Infrastructure (OCI).

# 💰 Finance AI

An intelligent financial health analysis platform developed during the Oracle Next Education (ONE) Hackathon.

The application analyzes a user's financial behavior based on income, debt level, savings habits, and financial transactions, providing personalized insights, spending classification, financial profile analysis, and improvement recommendations.

---

## 🚀 Features

- Automatic transaction classification
- Financial profile analysis
- Spending summary by category
- Personalized financial recommendations
- REST API
- Machine Learning integration
- Oracle Cloud Infrastructure (OCI) integration

---

## 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Validation
- SpringDoc OpenAPI (Swagger)

### Frontend

- React
- TypeScript
- TailwindCSS
- Axios

### Machine Learning

- Python
- Pandas
- Scikit-Learn
- Joblib

### Cloud

- Oracle Cloud Infrastructure (OCI)
- Object Storage

### DevOps

- GitHub
- GitHub Projects
- GitHub Actions
- Docker

---

## 📂 Project Structure

```
backend/
frontend/
ml/
docs/
```

---

## 🏗 Architecture

```
React

↓

Spring Boot REST API

↓

Machine Learning Model

↓

Oracle Cloud Infrastructure
```

---

## 📌 Main Endpoint

POST

```
/api/v1/financial-analysis
```

Example request

```json
{
  "monthlyIncome": 4500,
  "debtLevel": 25,
  "savingFrequency": "MEDIUM",
  "transactions": [
    {
      "description": "Supermarket",
      "value": 420
    }
  ]
}
```

---

## 👨‍💻 Team

Developed by Team Finance AI during the Oracle Next Education Hackathon.

---

## 📅 Roadmap

- [x] Project Planning
- [ ] Backend API
- [ ] Machine Learning Model
- [ ] Frontend
- [ ] OCI Integration
- [ ] Documentation
- [ ] Demo Day

---

## 📄 License

This project is licensed under the MIT License.
