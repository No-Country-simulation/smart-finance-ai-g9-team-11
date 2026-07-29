import pytest

from ml.scripts.pipeline.pipeline_completo import executar_pipeline


def test_pipeline_retorna_estrutura_esperada():
    features_modelo = {
        "renda_mensal_liquida": 4500.0,
        "despesa_total": 3200.0,
        "nivel_endividamento": 35.0,
        "poupanca_mensal": 300.0,
        "reserva_financeira": 5000.0,
        "meses_saldo_negativo": 0,
        "percentual_essenciais": 55.0,
        "ticket_medio": 85.0,
        "percentual_recorrentes": 20.0,
    }
    indicadores_negocio = {
        "margemSobra": 1300.0,
        "comprometimentoRenda": 71.0,
        "taxaPoupanca": 6.7,
        "mesesReserva": 1.56,
    }
    resumo_gastos = {"alimentacao": 800.0, "moradia": 1500.0}

    resultado = executar_pipeline(features_modelo, indicadores_negocio, resumo_gastos)

    assert "perfil_financeiro" in resultado
    assert "probabilidade" in resultado
    assert isinstance(resultado["recomendacoes"], list)
    assert len(resultado["recomendacoes"]) > 0


def test_pipeline_falha_com_features_faltantes():
    features_incompletas = {"renda_mensal_liquida": 4500.0}

    with pytest.raises(ValueError):
        executar_pipeline(features_incompletas, {}, {})


def test_pipeline_falha_com_features_extras():
    features_com_vazamento = {
        "renda_mensal_liquida": 4500.0,
        "despesa_total": 3200.0,
        "nivel_endividamento": 35.0,
        "poupanca_mensal": 300.0,
        "reserva_financeira": 5000.0,
        "meses_saldo_negativo": 0,
        "percentual_essenciais": 55.0,
        "ticket_medio": 85.0,
        "percentual_recorrentes": 20.0,
        "comprometimento_renda": 71.0,  # vazamento
    }

    with pytest.raises(ValueError):
        executar_pipeline(features_com_vazamento, {}, {})
