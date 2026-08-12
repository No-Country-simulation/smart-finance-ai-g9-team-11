"""
Teste E2E Simulado - Sprint 5
Usa TestClient do FastAPI para validar o fluxo completo
(ml/api/main.py -> feature_engineering -> pipeline_completo) SEM depender
da URL real da OCI.
"""

from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient

from ml.api.main import app

client = TestClient(app)

ENDPOINT = "/analise-financeira"


# ============================================
# HELPERS DE PAYLOAD
# ============================================
def gerar_transacao(descricao, valor, tipo, categoria, dias_atras=0):
    data_transacao = date.today() - timedelta(days=dias_atras)
    return {
        "descricao": descricao,
        "valor": valor,
        "tipo": tipo,
        "categoria": categoria,
        "data": data_transacao.isoformat(),
    }


@pytest.fixture
def payload_valido():
    return {
        "transactions": [
            gerar_transacao("Salário mensal", 5000.00, "Receita", "Salário", 30),
            gerar_transacao("Aluguel", 1500.00, "Despesa", "Moradia", 25),
            gerar_transacao("Supermercado", 800.00, "Despesa", "Alimentação", 20),
            gerar_transacao("Uber", 150.00, "Despesa", "Trajeto", 15),
            gerar_transacao("Netflix", 40.00, "Despesa", "Entretenimento", 10),
            gerar_transacao("Farmácia", 120.00, "Despesa", "Saúde", 5),
        ]
    }


@pytest.fixture
def payload_endividamento_alto():
    return {
        "transactions": [
            gerar_transacao("Salário", 3000.00, "Receita", "Salário", 30),
            gerar_transacao("Aluguel", 1800.00, "Despesa", "Moradia", 25),
            gerar_transacao("Cartão de crédito", 900.00, "Despesa", "Compras", 20),
            gerar_transacao("Financiamento carro", 700.00, "Despesa", "Trajeto", 15),
        ]
    }


# ============================================
# 1. FLUXO COMPLETO — PAYLOAD VÁLIDO
# ============================================
def test_fluxo_completo_payload_valido(payload_valido):
    response = client.post(ENDPOINT, json=payload_valido)

    assert response.status_code == 200
    data = response.json()

    assert "perfil_financeiro" in data
    assert "nivel_endividamento" in data
    assert "frequencia_poupanca" in data
    assert "probabilidade" in data
    assert "resumo_gastos" in data
    assert "recomendacoes" in data

    assert isinstance(data["recomendacoes"], list)
    assert data["frequencia_poupanca"] in ["Nenhuma", "Baixa", "Média", "Alta"]

    for categoria in [
        "Alimentação", "Moradia", "Compras", "Entretenimento",
        "Investimento", "Salário", "Saúde", "Trajeto",
        "Utilitários", "Outros",
    ]:
        assert categoria in data["resumo_gastos"]


# ============================================
# 2. LISTA DE TRANSAÇÕES VAZIA -> ERRO 422
# ============================================
def test_transacoes_vazias_retorna_erro():
    response = client.post(ENDPOINT, json={"transactions": []})
    assert response.status_code == 422


# ============================================
# 3. CAMPO OBRIGATÓRIO FALTANTE -> ERRO 422
# ============================================
def test_transacao_com_campo_faltante():
    payload_invalido = {
        "transactions": [
            {
                "descricao": "Compra sem valor",
                "tipo": "Despesa",
                "categoria": "Compras",
                "data": date.today().isoformat(),
            }
        ]
    }

    response = client.post(ENDPOINT, json=payload_invalido)
    assert response.status_code == 422


# ============================================
# 4. TIPO INVÁLIDO -> ERRO 422
# ============================================
def test_tipo_transacao_invalido():
    payload_invalido = {
        "transactions": [
            gerar_transacao("Transação estranha", 100.0, "Transferencia", "Outros")
        ]
    }

    response = client.post(ENDPOINT, json=payload_invalido)
    assert response.status_code == 422


# ============================================
# 5. DATA INVÁLIDA -> ERRO 422
# ============================================
def test_data_invalida():
    payload_invalido = {
        "transactions": [
            {
                "descricao": "Compra",
                "valor": 100.0,
                "tipo": "Despesa",
                "categoria": "Compras",
                "data": "31/02/2026",
            }
        ]
    }

    response = client.post(ENDPOINT, json=payload_invalido)
    assert response.status_code == 422


# ============================================
# 6. CENÁRIO: ENDIVIDAMENTO ALTO
# ============================================
def test_perfil_endividamento_alto(payload_endividamento_alto):
    response = client.post(ENDPOINT, json=payload_endividamento_alto)

    assert response.status_code == 200
    data = response.json()

    assert data["nivel_endividamento"] > 0
    assert len(data["recomendacoes"]) > 0


# ============================================
# 7. VOLUME MAIOR DE TRANSAÇÕES
# ============================================
def test_muitas_transacoes():
    transactions = [
        gerar_transacao(f"Compra {i}", 50.0 + i, "Despesa", "Compras", i)
        for i in range(50)
    ]
    transactions.append(gerar_transacao("Salário", 6000.0, "Receita", "Salário", 30))

    response = client.post(ENDPOINT, json={"transactions": transactions})

    assert response.status_code == 200
    assert "resumo_gastos" in response.json()
