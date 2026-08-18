from fastapi.testclient import TestClient

from ml.api.main import app

client = TestClient(app)


def test_analise_financeira_endpoint():
    payload = {
        "transactions": [
            {
                "data": "2026-07-01",
                "descricao": "Supermercado",
                "valor": 420.0,
                "tipo": "Despesa",
                "categoria": "Alimentação",
            },
            {
                "data": "2026-07-05",
                "descricao": "Salario",
                "valor": 5000.0,
                "tipo": "Receita",
                "categoria": "Salário",
            },
        ]
    }

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "perfil_financeiro" in data
    assert "nivel_endividamento" in data
    assert "frequencia_poupanca" in data
    assert "probabilidade" in data
    assert "resumo_gastos" in data
    assert "recomendacoes" in data


def test_analise_financeira_sem_transacoes_retorna_erro():
    payload = {"transactions": []}

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code == 422
