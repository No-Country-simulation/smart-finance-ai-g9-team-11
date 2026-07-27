from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Literal
from datetime import date

# Inicializa servidor
app = FastAPI(title="Finance AI - ML Mock Service for Java Devs")

# Esquema de dados que o Java vai enviar (Contrato de Entrada)
class Transaction(BaseModel):
    date: date
    description: str
    amount: float
    type: Literal["Income", "Expense"]

class ClassificationRequest(BaseModel):
    transactions: List[Transaction]


class ClassifiedTransaction(BaseModel):
    date: date
    description: str
    amount: float
    type: Literal["Income", "Expense"]
    category: str


class FinancialAnalysisRequest(BaseModel):
    transactions: List[ClassifiedTransaction]

@app.post("/classificar-transacoes")
def classificar_transacoes(payload: ClassificationRequest):

    print(f"{len(payload.transactions)} transações recebidas.")

    resultado = []

    for transacao in payload.transactions:

        # Aqui será chamado o modelo NLP
        categoria = "Shopping"

        resultado.append(
            {
                "date": transacao.date,
                "description": transacao.description,
                "amount": transacao.amount,
                "type": transacao.type,
                "category": categoria
            }
        )

    return {
        "transactions": resultado
    }

@app.post("/analise-financeira")
def analisar_financas(payload: FinancialAnalysisRequest):

    print(f"Analisando {len(payload.transactions)} transações.")

    # Aqui é chamado as features agregadas
    # e chama o resultado do modelo de perfil financeiro

    return {
        "perfil_financeiro": "Equilibrado",
        "probabilidade": 0.91,
        "resumo_gastos": {
            "alimentacao": 850.50,
            "transporte": 310.40,
            "compras": 420.80
        },
        "recomendacoes": [
            "Continue mantendo uma reserva financeira.",
            "Reduza gastos com compras não essenciais."
        ]
    }