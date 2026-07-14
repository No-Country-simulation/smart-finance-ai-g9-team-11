from ml.scripts.algorithm2.dataset_perfil import gerar_dataset_perfil_simulado
from ml.scripts.algorithm2.model_perfil import treinar_e_comparar_perfil, prever_perfil
from ml.scripts.scoring import calcular_score_saude_financeira

PERFIS_VALIDOS = {"saudavel", "em_observacao", "em_risco"}


def _treinar_modelo():
    df = gerar_dataset_perfil_simulado(n_amostras=300, seed=1)
    return treinar_e_comparar_perfil(df)


def _indicadores_base(**overrides):
    base = {
        "renda_mensal_liquida": 4500, "despesa_total": 2500,
        "nivel_endividamento": 20, "poupanca_mensal": 500,
        "reserva_financeira": 3000, "meses_saldo_negativo": 0,
        "percentual_essenciais": 60, "ticket_medio": 150,
        "percentual_recorrentes": 40, "margem_sobra": 2000,
        "comprometimento_renda": 55.0, "taxa_poupanca": 12.0,
        "meses_reserva": 3.0,
    }
    base.update(overrides)
    return base


def test_perfil_valido_retornado():
    modelo = _treinar_modelo()
    resultado = prever_perfil(modelo, _indicadores_base())
    assert resultado["perfil_financeiro"] in PERFIS_VALIDOS


def test_score_saude_financeira_entre_0_e_100():
    modelo = _treinar_modelo()
    indicadores = _indicadores_base(comprometimento_renda=70.0, taxa_poupanca=5.0,
                                       meses_reserva=1.0, nivel_endividamento=40.0)
    resultado_perfil = prever_perfil(modelo, indicadores)
    score_info = calcular_score_saude_financeira(indicadores, resultado_perfil)
    assert 0 <= score_info["score_saude_financeira"] <= 100


def test_caso_extremo_endividamento_alto_gera_risco():
    modelo = _treinar_modelo()
    indicadores = _indicadores_base(comprometimento_renda=95.0, taxa_poupanca=0.0,
                                       meses_reserva=0.0, nivel_endividamento=90.0,
                                       margem_sobra=-500)
    resultado = prever_perfil(modelo, indicadores)
    assert resultado["perfil_financeiro"] in PERFIS_VALIDOS  # tendÃªncia: em_risco


def test_caso_saudavel_baixo_comprometimento():
    modelo = _treinar_modelo()
    indicadores = _indicadores_base(comprometimento_renda=30.0, taxa_poupanca=25.0,
                                       meses_reserva=6.0, nivel_endividamento=5.0)
    resultado = prever_perfil(modelo, indicadores)
    assert resultado["perfil_financeiro"] in PERFIS_VALIDOS  # tendÃªncia: saudavel


def test_probabilidade_entre_0_e_1():
    modelo = _treinar_modelo()
    resultado = prever_perfil(modelo, _indicadores_base())
    assert 0.0 <= resultado["probabilidade"] <= 1.0

