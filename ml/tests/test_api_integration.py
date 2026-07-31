from fastapi.testclient import TestClient

from ml.api.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analise_financeira_endpoint():
    payload = {
        "transactions": [
            {
                "date": "2026-07-01",
                "description": "Supermercado",
                "amount": 420.0,
                "type": "DESPESA",
                "category": "ALIMENTACAO",
            },
            {
                "date": "2026-07-05",
                "description": "Salario",
                "amount": 5000.0,
                "type": "RECEITA",
                "category": "SALARIO",
            },
        ],
        "nivel_endividamento": 25.0,
        "frequencia_poupanca": "mensal",
    }

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "financialProfile" in data
    assert "recommendations" in data
    assert "indicadoresNegocio" in data


def test_analise_financeira_sem_receita_retorna_erro():
    payload = {
        "transactions": [
            {
                "date": "2026-07-01",
                "description": "Supermercado",
                "amount": 420.0,
                "type": "DESPESA",
                "category": "ALIMENTACAO",
            }
        ],
        "nivel_endividamento": 25.0,
        "frequencia_poupanca": "mensal",
    }

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code == 422
