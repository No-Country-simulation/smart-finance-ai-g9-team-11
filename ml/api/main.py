"""
API FastAPI - FinanceAI
Contrato atualizado conforme o Backend + correção de Data Leakage +
integração com o módulo do Vitor (NLP e agregações financeiras).

Regras aplicadas:
1. /classificar-transacoes recebe UMA transação por vez (não lista).
2. Enums padronizados: RECEITA/DESPESA e categorias em maiúsculas.
3. /analise-financeira recebe List[ClassifiedTransaction].
4. As 4 métricas com vazamento (margemSobra, comprometimentoRenda,
   taxaPoupanca, mesesReserva) NÃO entram no modelo, mas continuam
   disponíveis na resposta para uso no dashboard.
5. Resposta em camelCase (financialProfile, resumoGastos, etc.).
6. Classificação de texto e agregação financeira delegadas ao
   módulo do Vitor via vitor_service.py.
"""

from enum import Enum
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from pipeline_completo import executar_pipeline
from vitor_service import (
    VitorPayloadError,
    classificar_transacao,
    calcular_indicadores_financeiros,
    separar_features_e_negocio,
)

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
    """
    Métricas removidas do treinamento do modelo (evita data leakage),
    mas mantidas na resposta para exibição em dashboards e recomendações.
    """
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
# ENDPOINT 1 - Classificação (uma transação por requisição)
# Delegado ao Vitor (TF-IDF + Random Forest)
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
# Agregação delegada ao Vitor + separação modelo/negócio (Luciano)
# ============================================================

@app.post("/analise-financeira", response_model=FinancialAnalysisResponse)
def analise_financeira(payload: FinancialAnalysisRequest):
    try:
        transacoes_dict = [t.dict() for t in payload.transactions]

        # 1. Vitor calcula a base financeira agregada (despesa_total, etc.)
        base_financeira = calcular_indicadores_financeiros(
            transacoes_dict, payload.nivel_endividamento
        )

        # 2. Luciano separa em features_modelo (9, sem vazamento) x
        #    indicadores_negocio (4, só exibição) x resumo_gastos
        dados = separar_features_e_negocio(base_financeira)

        # 3. Pipeline do Luciano: Gradient Boosting + motor de recomendações
        resultado = executar_pipeline(dados["features_modelo"])

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
