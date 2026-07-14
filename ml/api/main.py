"""
main.py
ServiÃ§o FastAPI consumido pelo Spring Boot (via MlServiceClient),
conforme a arquitetura definida pela equipe.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

from ml.scripts.model_registry import carregar_modelo_com_metadados
from ml.scripts.pipeline.pipeline_completo import executar_pipeline_completo
from ml.scripts.validation import ErroValidacaoTransacoes

app = FastAPI(title="Finance AI - ML Service", version="1.0.0")

modelo_transacoes, _ = carregar_modelo_com_metadados(
    "ml/models/classificador_transacoes.joblib", "ml/metrics/classificador_transacoes.json"
)
modelo_perfil, _ = carregar_modelo_com_metadados(
    "ml/models/classificador_perfil.joblib", "ml/metrics/classificador_perfil.json"
)


class TransacaoRequest(BaseModel):
    descricao: str
    valor: float = Field(gt=0)


class AnaliseFinanceiraRequest(BaseModel):
    usuario_id: Optional[str] = None
    renda_mensal: float = Field(gt=0)
    nivel_endividamento: float = Field(ge=0, le=100)
    poupanca_mensal: Optional[float] = 0
    reserva_financeira: Optional[float] = 0
    meses_saldo_negativo: Optional[int] = 0
    frequencia_poupanca: Optional[str] = "Baixa"
    transacoes: List[TransacaoRequest]


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analise-financeira")
def analise_financeira(payload: AnaliseFinanceiraRequest):
    try:
        transacoes = [t.dict() for t in payload.transacoes]
        dados_financeiros = payload.dict(exclude={"transacoes"})

        resultado = executar_pipeline_completo(
            transacoes, dados_financeiros, modelo_transacoes, modelo_perfil,
            usuario_id=payload.usuario_id
        )
        return resultado

    except ErroValidacaoTransacoes as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")




