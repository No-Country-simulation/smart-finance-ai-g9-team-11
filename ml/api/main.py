from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

# Inicializa servidor
app = FastAPI(title="Finance AI - ML Mock Service for Java Devs")

# Esquema de dados que o Java vai enviar (Contrato de Entrada)
class Transacao(BaseModel):
    descricao: str
    valor: float

class AnaliseRequest(BaseModel):
    renda_mensal: float
    nivel_endividamento: float
    frequencia_poupanca: str
    transacoes: List[Transacao]

# Endpoint que o backend Java vai consumir
@app.post("/analise-financeira")
def predict_financial_profile(payload: AnaliseRequest):
    try:
        # LOG para o Dev de DevOps (você) e os do Backend verem o dado chegando no terminal do Docker
        print(f"Recebida requisição para análise. Renda: {payload.renda_mensal}")
        
        # MOCK SÊNIOR: Retorna uma estrutura idêntica à exigida no PDF do Hackathon
        # Dica de arquitetura: Os campos aqui usam snake_case (padrão Python/ML)
        return {
            "perfil_financeiro": "Em observacao",
            "probabilidade": 0.82,
            "resumo_gastos": {
                "alimentacao": 420.0,
                "transporte": 300.0,
                "entretenimento": 40.0
            },
            "recomendacoes": [
                "Monitorar gastos recorrentes de entretenimento",
                "Aumentar reserva financeira mensal"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar dados: {str(e)}")