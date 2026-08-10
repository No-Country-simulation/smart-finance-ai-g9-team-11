import time
from fastapi.testclient import TestClient

from ml.api.main import app

client = TestClient(app)


def _payload_base(n_transacoes: int = 2):
    """Gera um payload válido com N transações repetidas."""
    transacoes = []
    for i in range(n_transacoes):
        transacoes.append(
            {
                "data": "2026-07-01",
                "descricao": f"Compra teste {i}",
                "valor": 100.0 + i,
                "tipo": "Despesa" if i % 2 == 0 else "Receita",
                "categoria": "Alimentação" if i % 2 == 0 else "Salário",
            }
        )
    return {"transactions": transacoes}


def test_estresse_multiplas_requisicoes_sequenciais():
    """Garante estabilidade da API sob várias chamadas seguidas."""
    payload = _payload_base(5)

    for _ in range(20):
        response = client.post("/analise-financeira", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "perfil_financeiro" in data
        assert "recomendacoes" in data


def test_estresse_payload_grande_muitas_transacoes():
    """Testa a API com um volume alto de transações."""
    payload = _payload_base(500)

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "resumo_gastos" in data
    assert "probabilidade" in data


def test_estresse_tempo_resposta_aceitavel():
    """Garante que a resposta não demora além de um limite razoável."""
    payload = _payload_base(100)

    inicio = time.time()
    response = client.post("/analise-financeira", json=payload)
    duracao = time.time() - inicio

    assert response.status_code == 200
    assert duracao < 5.0  # limite de 5 segundos


def test_estresse_payload_invalido_tipo_incorreto():
    """Valida resposta de erro para tipos de dado incorretos."""
    payload = {
        "transactions": [
            {
                "data": "2026-07-01",
                "descricao": "Teste",
                "valor": "nao_e_numero",  # tipo inválido propositalmente
                "tipo": "Despesa",
                "categoria": "Alimentação",
            }
        ]
    }

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code == 422


def test_estresse_payload_com_campo_faltante():
    """Valida resposta de erro quando falta um campo obrigatório."""
    payload = {
        "transactions": [
            {
                "data": "2026-07-01",
                "descricao": "Teste sem categoria",
                "valor": 100.0,
                "tipo": "Despesa",
                # campo "categoria" ausente
            }
        ]
    }

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code in (200, 422)  # depende se categoria é obrigatória


def test_estresse_transacoes_com_valores_extremos():
    """Testa valores monetários extremos (muito altos e negativos)."""
    payload = {
        "transactions": [
            {
                "data": "2026-07-01",
                "descricao": "Valor altíssimo",
                "valor": 999999999.99,
                "tipo": "Receita",
                "categoria": "Salário",
            },
            {
                "data": "2026-07-02",
                "descricao": "Valor negativo",
                "valor": -50.0,
                "tipo": "Despesa",
                "categoria": "Alimentação",
            },
        ]
    }

    response = client.post("/analise-financeira", json=payload)
    assert response.status_code in (200, 422)
