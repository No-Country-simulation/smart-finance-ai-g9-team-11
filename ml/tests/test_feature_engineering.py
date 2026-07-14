import pandas as pd
import pytest
from ml.scripts.feature_engineering import calcular_indicadores_financeiros


def test_calcula_despesa_total_corretamente():
    df = pd.DataFrame([
        {"categoria": "alimentacao", "valor": 200.0},
        {"categoria": "transporte", "valor": 100.0},
    ])
    dados_financeiros = {"renda_mensal": 1000.0, "poupanca_mensal": 100.0, "reserva_financeira": 600.0}
    indicadores = calcular_indicadores_financeiros(df, dados_financeiros)
    assert indicadores["despesa_total"] == 300.0


def test_categoria_dominante_correta():
    df = pd.DataFrame([
        {"categoria": "alimentacao", "valor": 500.0},
        {"categoria": "lazer", "valor": 50.0},
    ])
    dados_financeiros = {"renda_mensal": 2000.0, "poupanca_mensal": 200.0, "reserva_financeira": 1000.0}
    indicadores = calcular_indicadores_financeiros(df, dados_financeiros)
    assert indicadores["categoria_dominante"] == "alimentacao"


def test_taxa_poupanca_calculada_corretamente():
    df = pd.DataFrame([{"categoria": "moradia", "valor": 800.0}])
    dados_financeiros = {"renda_mensal": 4000.0, "poupanca_mensal": 400.0, "reserva_financeira": 2000.0}
    indicadores = calcular_indicadores_financeiros(df, dados_financeiros)
    assert indicadores["taxa_poupanca"] == pytest.approx(10.0)


def test_meses_reserva_calculado_corretamente():
    df = pd.DataFrame([{"categoria": "moradia", "valor": 1000.0}])
    dados_financeiros = {"renda_mensal": 3000.0, "poupanca_mensal": 300.0, "reserva_financeira": 3000.0}
    indicadores = calcular_indicadores_financeiros(df, dados_financeiros)
    assert indicadores["meses_reserva"] == pytest.approx(3.0)


def test_dataframe_vazio_nao_quebra():
    df = pd.DataFrame(columns=["categoria", "valor"])
    dados_financeiros = {"renda_mensal": 2500.0, "poupanca_mensal": 100.0, "reserva_financeira": 500.0}
    indicadores = calcular_indicadores_financeiros(df, dados_financeiros)
    assert indicadores["despesa_total"] == 0.0

