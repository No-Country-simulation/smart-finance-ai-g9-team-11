import pytest

from ml.scripts.algorithm1.dataset_transacoes import gerar_dataset_transacoes_simulado
from ml.scripts.algorithm1.model_transacoes import treinar_e_comparar_modelos
from ml.scripts.algorithm2.dataset_perfil import gerar_dataset_perfil_simulado
from ml.scripts.algorithm2.model_perfil import treinar_e_comparar_perfil
from ml.scripts.pipeline.pipeline_completo import executar_pipeline_completo


@pytest.fixture(scope="module")
def modelos_treinados():
    df_t = gerar_dataset_transacoes_simulado(n_amostras=300, seed=1)
    df_p = gerar_dataset_perfil_simulado(n_amostras=300, seed=1)
    return treinar_e_comparar_modelos(df_t), treinar_e_comparar_perfil(df_p)


def test_pipeline_completo_gera_dashboard_valido(modelos_treinados):
    modelo1, modelo2 = modelos_treinados

    transacoes = [
        {"descricao": "Supermercado Mateus", "valor": 420.0},
        {"descricao": "Netflix", "valor": 40.0},
        {"descricao": "Uber", "valor": 60.0},
    ]
    dados_financeiros = {"renda_mensal": 4500, "nivel_endividamento": 25}

    resultado = executar_pipeline_completo(transacoes, dados_financeiros, modelo1, modelo2)

    assert "visao_geral" in resultado
    assert "comportamento" in resultado
    assert "saude_risco" in resultado
    assert "recomendacoes_financeiras" in resultado
    assert resultado["saude_risco"]["perfil_financeiro"] in modelo2["classes"]
    assert 0 <= resultado["saude_risco"]["score_saude_financeira"] <= 100


def test_pipeline_rejeita_transacoes_invalidas(modelos_treinados):
    modelo1, modelo2 = modelos_treinados

    transacoes = [
        {"descricao": "", "valor": -10},
        {"descricao": "Supermercado Mateus", "valor": 420.0},
    ]
    dados_financeiros = {"renda_mensal": 4500, "nivel_endividamento": 25}

    resultado = executar_pipeline_completo(transacoes, dados_financeiros, modelo1, modelo2)
    assert len(resultado["_debug"]["transacoes_rejeitadas_na_validacao"]) >= 1


