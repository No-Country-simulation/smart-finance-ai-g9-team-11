from datetime import date
from typing import List, Literal, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from ml.scripts.algorithm1.predict import predizer_categoria
from ml.scripts.feature_engineering import extrair_features
from ml.scripts.pipeline.pipeline_completo import executar_pipeline

app = FastAPI(title="Finance AI - ML Service")

print("=== FASTAPI ALINHADO COM O CONTRATO DO BACKEND ===")

# ==========================================
# FUNÇÕES AUXILIARES / UTILITÁRIOS
# ==========================================


def calcular_frequencia_poupanca(taxa_poupanca: float) -> str:
    """Classifica a frequência/intensidade de poupança com base na taxa percentual."""
    if taxa_poupanca <= 0:
        return "Nenhuma"
    elif taxa_poupanca < 15:
        return "Baixa"
    elif taxa_poupanca < 30:
        return "Média"
    else:
        return "Alta"


# ==========================================
# 1. CLASSIFICAÇÃO DE TRANSAÇÕES
# ==========================================


class TransactionRequest(BaseModel):
    id: Optional[int] = None
    descricao: str
    valor: float
    tipo: Literal["Receita", "Despesa"]
    data: date
    usuarioId: Optional[int] = None


class TransactionResponse(BaseModel):
    id: Optional[int] = None
    descricao: str
    valor: float
    tipo: str
    categoria: str
    data: date
    usuarioId: Optional[int] = None


@app.post("/classificar-transacoes", response_model=TransactionResponse)
def classificar_transacao(payload: TransactionRequest):
    categoria = predizer_categoria(payload.descricao)

    return TransactionResponse(
        id=payload.id,
        descricao=payload.descricao,
        valor=payload.valor,
        tipo=payload.tipo,
        categoria=categoria,
        data=payload.data,
        usuarioId=payload.usuarioId,
    )


# ==========================================
# 2. ANÁLISE FINANCEIRA
# ==========================================


class FinancialAnalysisRequest(BaseModel):
    data_inicial: date
    data_final: date
    transactions: List[dict]  # Envio obrigatório garantido pelo backend Java


class ResumoGastosBackend(BaseModel):
    Alimentação: float = Field(0.0, alias="Alimentação")
    Moradia: float = Field(0.0, alias="Moradia")
    Compras: float = Field(0.0, alias="Compras")
    Entretenimento: float = Field(0.0, alias="Entretenimento")
    Investimento: float = Field(0.0, alias="Investimento")
    Salário: float = Field(0.0, alias="Salário")
    Saúde: float = Field(0.0, alias="Saúde")
    Trajeto: float = Field(0.0, alias="Trajeto")
    Utilitários: float = Field(0.0, alias="Utilitários")
    Outros: float = Field(0.0, alias="Outros")

    class Config:
        populate_by_name = True


class FinancialAnalysisResponse(BaseModel):
    perfil_financeiro: str
    nivel_endividamento: float
    frequencia_poupanca: str
    probabilidade: float
    resumo_gastos: dict
    recomendacoes: List[str]


@app.post(
    "/analise-financeira", response_model=FinancialAnalysisResponse
)
def analisar_financas(payload: FinancialAnalysisRequest):
    try:
        # Validar se a lista de transações não foi enviada vazia
        if not payload.transactions:
            raise HTTPException(
                status_code=422,
                detail="A lista de transações não pode estar vazia.",
            )

        # 1. Carrega as transações categorizadas no DataFrame Pandas
        raw_data = payload.transactions
        df = pd.DataFrame(raw_data)

        # 2. Renomeia as colunas para a padronização do feature_engineering
        df = df.rename(
            columns={
                "data": "Date",
                "descricao": "Transaction Description",
                "valor": "Amount",
                "tipo": "Type",
                "categoria": "Category",
            }
        )

        # 3. Conversão tratada de data (ISO YYYY-MM-DD) prevenindo erros de parse
        df["Date"] = pd.to_datetime(df["Date"], format="mixed", dayfirst=False)

        # 4. Extração de Features e Indicadores
        dados = extrair_features(df)
        resultado = executar_pipeline(
            dados["features_modelo"],
            dados["indicadores_negocio"],
            dados["resumo_gastos"],
        )

        # 5. Cálculo do total real da receita de 'Salário' no período
        total_salario = df.loc[
            (df["Type"] == "Receita") & (df["Category"] == "Salário"), "Amount"
        ].sum()

        # 6. Mapeia o resumo de gastos para o padrão de chaves do Backend Java
        resumo_mapeado = {
            "Alimentação": dados["resumo_gastos"].get("alimentacao", 0.0),
            "Moradia": dados["resumo_gastos"].get("moradia", 0.0),
            "Compras": dados["resumo_gastos"].get("compras", 0.0),
            "Entretenimento": dados["resumo_gastos"].get(
                "entretenimento", 0.0
            ),
            "Investimento": dados["resumo_gastos"].get("investimento", 0.0),
            "Salário": round(float(total_salario), 2),
            "Saúde": dados["resumo_gastos"].get("saude", 0.0),
            "Trajeto": dados["resumo_gastos"].get("transporte", 0.0),
            "Utilitários": dados["resumo_gastos"].get("utilitarios", 0.0),
            "Outros": dados["resumo_gastos"].get("outros", 0.0),
        }

        # 7. Resgata ou calcula dinamicamente a Frequência de Poupança
        frequencia_poupanca = dados["indicadores_negocio"].get(
            "frequenciaPoupanca",
            calcular_frequencia_poupanca(
                dados["indicadores_negocio"].get("taxaPoupanca", 0.0)
            ),
        )

        # 8. Retorno no formato exato do DTO esperado pelo backend
        return FinancialAnalysisResponse(
            perfil_financeiro=resultado["perfil_financeiro"],
            nivel_endividamento=dados["features_modelo"]["nivel_endividamento"],
            frequencia_poupanca=frequencia_poupanca,
            probabilidade=resultado["probabilidade"],
            resumo_gastos=resumo_mapeado,
            recomendacoes=resultado["recomendacoes"],
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar análise financeira: {str(e)}",
        )