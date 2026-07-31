from datetime import date
from typing import List, Literal

from fastapi import FastAPI
from pydantic import BaseModel


from scripts.algorithm1.predict import predizer_categoria

from fastapi import HTTPException

from ml.scripts.pipeline.pipeline_completo import executar_pipeline
from ml.scripts.perfil_features import preparar_features_e_indicadores
from ml.vitor_service import (
    VitorPayloadError,
    calcular_indicadores_financeiros,
)

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
        "data": payload.date,
        "descrição": payload.description,
        "quantidade": payload.amount,
        "tipo": payload.type,
        "categoria": categoria,
    }


# ==========================
# ANÁLISE FINANCEIRA (MOCK)
# ==========================


class FinancialAnalysisRequest(BaseModel):
    transactions: List[ClassifiedTransaction]


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

class IndicadoresNegocio(BaseModel):
    margemSobra: float
    comprometimentoRenda: float
    taxaPoupanca: float
    mesesReserva: float


class FinancialAnalysisResponse(BaseModel):
    financialProfile: str
    nivelEndividamento: float
    frequenciaPoupanca: str
    probabilidade: float
    resumoGastos: ExpenseSummary
    indicadoresNegocio: IndicadoresNegocio
    recommendations: List[str]

@app.post("/api/v1/financial-analysis", response_model=FinancialAnalysisResponse)
def analisar_financas(payload: FinancialAnalysisRequest):

    try:

        transacoes = [
            t.model_dump()
            for t in payload.transactions
        ]

        base_financeira = calcular_indicadores_financeiros(
            transacoes,
            payload.nivelEndividamento,
        )

        dados = preparar_features_e_indicadores(
            base_financeira
        )

        resultado = executar_pipeline(
            dados["features_modelo"],
            dados["indicadores_negocio"],
            dados["resumo_gastos"],
        )

        return FinancialAnalysisResponse(
            financialProfile=resultado["perfil_financeiro"],
            nivelEndividamento=payload.nivelEndividamento,
            frequenciaPoupanca=payload.frequenciaPoupanca,
            probabilidade=resultado["probabilidade"],
            resumoGastos=ExpenseSummary(
                **dados["resumo_gastos"]
            ),
            indicadoresNegocio=IndicadoresNegocio(
                **dados["indicadores_negocio"]
            ),
            recommendations=resultado["recomendacoes"],
        )

    except VitorPayloadError as e:
        raise HTTPException(
            status_code=422,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )