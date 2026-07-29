"""
API FastAPI - FinanceAI
"""

from enum import Enum
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from ml.scripts.pipeline.pipeline_completo import executar_pipeline
from ml.vitor_service import (
    VitorPayloadError,
    classificar_transacao,
    calcular_indicadores_financeiros,
)
from ml.scripts.perfil_features import preparar_features_e_indicadores

app = FastAPI(
    title="Finance AI - Classificação e Perfil de Risco",
    version="2.1.0",
)


# ============================================================
# ENUMS
# ============================================================

class TipoTransacao(str, Enum):
    RECEITA = "RECEITA"
    DESPESA = "DESPESA"


class CategoriaTransacao(str, Enum):
    ALIMENTACAO = "ALIMENTACAO"
    MORADIA = "MORADIA"
    COMPRAS = "COMPRAS"
    ENTRETENIMENTO = "ENTRETENIMENTO"
    INVESTIMENTO = "INVESTIMENTO"
    SALARIO = "SALARIO"
    SAUDE = "SAUDE"
    TRANSPORTE = "TRANSPORTE"
    UTILITARIOS = "UTILITARIOS"
    OUTROS = "OUTROS"


class PerfilFinanceiro(str, Enum):
    SAUDAVEL = "SAUDAVEL"
    EM_OBSERVACAO = "EM_OBSERVACAO"
    EM_RISCO = "EM_RISCO"


# ============================================================
# SCHEMAS - Classificação
# ============================================================

class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    type: TipoTransacao


class ClassifiedTransaction(Transaction):
    category: CategoriaTransacao


# ============================================================
# SCHEMAS - Análise Financeira (Request)
# ============================================================

class FinancialAnalysisRequest(BaseModel):
    transactions: List[ClassifiedTransaction]
    nivel_endividamento: Optional[float] = Field(0.0, ge=0, le=100)
    frequencia_poupanca: Optional[str] = "mensal"


# ============================================================
# SCHEMAS - Análise Financeira (Response)
# ============================================================

class ResumoGastos(BaseModel):
    alimentacao: float = 0.0
    moradia: float = 0.0
    compras: float = 0.0
    entretenimento: float = 0.0
    investimento: float = 0.0
    saude: float = 0.0
    transporte: float = 0.0
    utilitarios: float = 0.0
    outros: float = 0.0


class IndicadoresNegocio(BaseModel):
    margemSobra: float
    comprometimentoRenda: float
    taxaPoupanca: float
    mesesReserva: float


class FinancialAnalysisResponse(BaseModel):
    financialProfile: PerfilFinanceiro
    nivelEndividamento: float
    frequenciaPoupanca: str
    probabilidade: float
    resumoGastos: ResumoGastos
    indicadoresNegocio: IndicadoresNegocio
    recommendations: List[str]


# ============================================================
# ENDPOINT 1 - Classificação
# ============================================================

@app.post("/classificar-transacoes", response_model=ClassifiedTransaction)
def classificar_transacoes(payload: Transaction):
    try:
        categoria = classificar_transacao(
            payload.description, payload.amount, payload.type.value
        )
        return ClassifiedTransaction(
            date=payload.date,
            description=payload.description,
            amount=payload.amount,
            type=payload.type,
            category=CategoriaTransacao(categoria),
        )
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Erro ao classificar transação: {e}"
        )


# ============================================================
# ENDPOINT 2 - Análise Financeira
# ============================================================

@app.post("/analise-financeira", response_model=FinancialAnalysisResponse)
def analise_financeira(payload: FinancialAnalysisRequest):
    try:
        transacoes_dict = [t.dict() for t in payload.transactions]

        base_financeira = calcular_indicadores_financeiros(
            transacoes_dict, payload.nivel_endividamento
        )

        dados = preparar_features_e_indicadores(base_financeira)

        resultado = executar_pipeline(
            dados["features_modelo"],
            dados["indicadores_negocio"],
            dados["resumo_gastos"],
        )

        return FinancialAnalysisResponse(
            financialProfile=PerfilFinanceiro(resultado["perfil_financeiro"]),
            nivelEndividamento=payload.nivel_endividamento,
            frequenciaPoupanca=payload.frequencia_poupanca,
            probabilidade=resultado["probabilidade"],
            resumoGastos=ResumoGastos(**dados["resumo_gastos"]),
            indicadoresNegocio=IndicadoresNegocio(**dados["indicadores_negocio"]),
            recommendations=resultado["recomendacoes"],
        )
    except VitorPayloadError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")


# ============================================================
# HEALTHCHECK
# ============================================================

@app.get("/health")
def health():
    return {"status": "ok"}
