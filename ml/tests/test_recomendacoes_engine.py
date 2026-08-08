from ml.scripts.recomendacoes_engine import gerar_recomendacoes


def _features_base(**overrides):
    """Features padrão 'saudáveis', sobrescrevíveis por teste."""
    base = {
        "nivel_endividamento": 10.0,
        "poupanca_mensal": 500.0,
        "reserva_financeira": 6000.0,
        "meses_saldo_negativo": 0,
        "percentual_essenciais": 50.0,
        "percentual_recorrentes": 20.0,
        "despesa_total": 2000.0,
        "renda_mensal_liquida": 5000.0,
    }
    base.update(overrides)
    return base


def _indicadores_base(**overrides):
    base = {
        "taxaPoupanca": 20.0,
        "mesesReserva": 3.0,
        "comprometimentoRenda": 40.0,
    }
    base.update(overrides)
    return base


def test_endividamento_alto_gera_recomendacao():
    features = _features_base(nivel_endividamento=55.0)
    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), {}, "Em risco")

    assert any("renegociação de dívidas" in r for r in recomendacoes)


def test_endividamento_moderado_gera_recomendacao():
    features = _features_base(nivel_endividamento=35.0)
    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), {}, "Em observação")

    assert any("uso de crédito" in r for r in recomendacoes)


def test_comprometimento_renda_critico():
    features = _features_base()
    indicadores = _indicadores_base(comprometimentoRenda=95.0)
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Em risco")

    assert any("Revisar despesas com urgência" in r for r in recomendacoes)


def test_poupanca_negativa_gera_recomendacao():
    features = _features_base(poupanca_mensal=-100.0)
    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), {}, "Em risco")

    assert any("orçamento mensal" in r for r in recomendacoes)


def test_taxa_poupanca_baixa_gera_recomendacao():
    features = _features_base(poupanca_mensal=50.0)
    indicadores = _indicadores_base(taxaPoupanca=5.0)
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Em observação")

    assert any("Aumentar a frequência de poupança" in r for r in recomendacoes)


def test_reserva_inferior_a_um_mes():
    features = _features_base()
    indicadores = _indicadores_base(mesesReserva=0.5)
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Em risco")

    assert any("reserva de emergência" in r for r in recomendacoes)


def test_reserva_entre_um_e_tres_meses():
    features = _features_base()
    indicadores = _indicadores_base(mesesReserva=2.0)
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Em observação")

    assert any("Fortalecer a reserva financeira" in r for r in recomendacoes)


def test_saldo_negativo_recorrente():
    features = _features_base(meses_saldo_negativo=2)
    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), {}, "Em risco")

    assert any("saldo negativo mensal" in r for r in recomendacoes)


def test_percentual_essenciais_alto():
    features = _features_base(percentual_essenciais=85.0)
    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), {}, "Em observação")

    assert any("despesas essenciais" in r for r in recomendacoes)


def test_percentual_recorrentes_alto():
    features = _features_base(percentual_recorrentes=45.0)
    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), {}, "Em observação")

    assert any("assinaturas e contas recorrentes" in r for r in recomendacoes)


def test_categoria_de_maior_gasto_acima_de_35_por_cento():
    features = _features_base(despesa_total=1000.0)
    resumo_gastos = {"Entretenimento": 400.0, "Alimentação": 300.0, "Trajeto": 300.0}

    recomendacoes = gerar_recomendacoes(features, _indicadores_base(), resumo_gastos, "Em observação")

    assert any("Entretenimento" in r for r in recomendacoes)


def test_perfil_saudavel_sem_alertas_gera_recomendacao_de_investimento():
    features = _features_base()
    indicadores = _indicadores_base()
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Saudável")

    assert any("investir a sobra mensal" in r for r in recomendacoes)


def test_perfil_em_risco_com_indicadores_controlados():
    features = _features_base(nivel_endividamento=15.0)
    indicadores = _indicadores_base(comprometimentoRenda=50.0)
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Em risco")

    assert any("Reavaliar hábitos financeiros gerais" in r for r in recomendacoes)


def test_fallback_quando_nenhuma_regra_ativada():
    features = _features_base()
    indicadores = _indicadores_base()
    recomendacoes = gerar_recomendacoes(features, indicadores, {}, "Outro")

    assert any("acompanhamento mensal" in r for r in recomendacoes)
