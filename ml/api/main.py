from datetime import date
from typing import List, Literal

from fastapi import FastAPI
from pydantic import BaseModel


from scripts.algorithm1.predict import predizer_categoria

app = FastAPI(title="Finance AI - ML Mock Service for Java Devs")

print("=== FASTAPI ATUALIZADO CARREGADO ===")

# ==========================
# ENUMS
# ==========================

TransactionType = Literal["Receita", "Despesa"]

TransactionCategory = Literal[
    
    "Alimentação",
    "Utilitários",
    "Aluguel",
    "Investimento",
    "Compras",
    "Saúde",
    "Entretenimento",
    "Trajeto",
    "Salário",
    "Outros",
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
    utilitarios: float
    Aluguel: float
    Investimento: float
    Compras: float
    saude: float
    Entretenimento: float
    Trajeto: float
    Salario: float
    outros: float


class FinancialAnalysisResponse(BaseModel):
    financialProfile: str
    nivelEndividamento: float
    frequenciaPoupanca: str
    probabilidade: float
    resumoGastos: ExpenseSummary
    recommendations: List[str]


@app.post("/api/v1/financial-analysis", response_model=FinancialAnalysisResponse)
def analisar_financas(payload: FinancialAnalysisRequest):

    print(f"Analisando {len(payload.transactions)} transações.")

    return FinancialAnalysisResponse(
        financialProfile="EM_OBSERVACAO",
        nivelEndividamento=3,
        frequenciaPoupanca="BAIXA",
        probabilidade=0.91,
        resumoGastos=ExpenseSummary(
            alimentacao=850.50,
            utilitarios=0,
            aluguel=420.80,
            investimento=0,
            compras=0,
            saude=5000,
            entretenimento=0,
            trajetoria=310.40,
            salarios=0,
            outros=0,
        ),
        recommendations=[
            "Continue mantendo uma reserva financeira.",
            "Reduza gastos com compras não essenciais.",
        ],
    )
