from datetime import date
from typing import List, Literal

from fastapi import FastAPI
from pydantic import BaseModel

from fastapi import Request

import joblib
import pickle
from scripts.algorithm1.predict import predizer_categoria

app = FastAPI(title="Finance AI - ML Mock Service for Java Devs")
print("=== FASTAPI ATUALIZADO CARREGADO ===")


# ==========================
# ENUMS
# ==========================

TransactionType = Literal["RECEITA", "DESPESA"]

TransactionCategory = Literal[
    "ALIMENTACAO",
    "MORADIA",
    "COMPRAS",
    "ENTRETENIMENTO",
    "INVESTIMENTO",
    "SALARIO",
    "SAUDE",
    "TRANSPORTE",
    "UTILITARIOS",
    "OUTROS",
]


# ==========================
# CLASSIFICAÇÃO DE TRANSAÇÃO
# ==========================


print("=== FASTAPI ATUALIZADO CARREGADO ===")

# ==========================
# ENUMS
# ==========================

TransactionType = Literal["RECEITA", "DESPESA"]

TransactionCategory = Literal[
    "ALIMENTACAO",
    "MORADIA",
    "COMPRAS",
    "ENTRETENIMENTO",
    "INVESTIMENTO",
    "SALARIO",
    "SAUDE",
    "TRANSPORTE",
    "UTILITARIOS",
    "OUTROS",
]


# ==========================
# CLASSIFICAÇÃO DE TRANSAÇÃO
# ==========================


class Transaction(BaseModel):
    date: date
    description: str
    amount: float
    type: TransactionType


class ClassifiedTransaction(BaseModel):
    date: date
    description: str
    amount: float
    type: TransactionType
    category: TransactionCategory


@app.post("/classificar-transacoes")
def classificar_transacao(payload: Transaction):
    print("Transação recebida:", payload)

    categoria = predizer_categoria(payload.description)
    categoria = MAPA_CATEGORIAS.get(categoria, "OUTROS")
    return {
        "date": payload.date,
        "description": payload.description,
        "amount": payload.amount,
        "type": payload.type,
        "category": categoria,
    }


# ==========================
# ANÁLISE FINANCEIRA (MOCK)
# ==========================


 class FinancialAnalysisRequest(BaseModel):
    transactions: List[Transaction]


class ExpenseSummary(BaseModel):
    alimentacao: float
    moradia: float
    compras: float
    entretenimento: float
    investimento: float
    salario: float
    saude: float
    transporte: float
    utilitarios: float
    outros: float


class FinancialAnalysisResponse(BaseModel):
    financialProfile: str
    nivelEndividamento: float
    frequenciaPoupanca: str
    probabilidade: float
    resumoGastos: ExpenseSummary
    recommendations: List[str]


@app.post("/analise-financeira", response_model=FinancialAnalysisResponse)
def analisar_financas(payload: FinancialAnalysisRequest):

    print(f"Analisando {len(payload.transactions)} transações.")

    return FinancialAnalysisResponse(
        financialProfile="EM_OBSERVACAO",
        nivelEndividamento=3,
        frequenciaPoupanca="BAIXA",
        probabilidade=0.91,
        resumoGastos=ExpenseSummary(
            alimentacao=850.50,
            moradia=0,
            compras=420.80,
            entretenimento=0,
            investimento=0,
            salario=5000,
            saude=0,
            transporte=310.40,
            utilitarios=0,
            outros=0,
        ),
        recommendations=[
            "Continue mantendo uma reserva financeira.",
            "Reduza gastos com compras não essenciais.",
        ],
    )
