import pandas as pd
from ml.scripts.algorithm1.dataset_transacoes import gerar_dataset_transacoes_simulado
from ml.scripts.algorithm1.model_transacoes import treinar_e_comparar_modelos, classificar_transacoes

CATEGORIAS_VALIDAS = {
    "alimentacao", "transporte", "saude", "moradia",
    "educacao", "lazer", "servicos", "outras"
}


def _treinar_modelo():
    df = gerar_dataset_transacoes_simulado(n_amostras=300, seed=1)
    return treinar_e_comparar_modelos(df)


def test_classifica_categoria_valida():
    modelo = _treinar_modelo()
    df = pd.DataFrame([{"descricao": "Supermercado Mateus", "valor": 420.0}])
    resultado = classificar_transacoes(df, modelo)
    assert resultado.iloc[0]["categoria"] in CATEGORIAS_VALIDAS


def test_probabilidade_entre_0_e_1():
    modelo = _treinar_modelo()
    df = pd.DataFrame([{"descricao": "Posto Ipiranga", "valor": 150.0}])
    resultado = classificar_transacoes(df, modelo)
    assert 0.0 <= resultado.iloc[0]["probabilidade"] <= 1.0


def test_retorna_todas_as_colunas_esperadas():
    modelo = _treinar_modelo()
    df = pd.DataFrame([{"descricao": "Farmacia Popular", "valor": 89.90}])
    resultado = classificar_transacoes(df, modelo)
    colunas_esperadas = {"descricao", "valor", "categoria", "probabilidade", "nivel_confianca", "necessita_revisao"}
    assert colunas_esperadas.issubset(set(resultado.columns))


def test_descricao_desconhecida_nao_quebra():
    modelo = _treinar_modelo()
    df = pd.DataFrame([{"descricao": "xzq123 aleatorio", "valor": 10.0}])
    resultado = classificar_transacoes(df, modelo)
    assert resultado.iloc[0]["categoria"] in CATEGORIAS_VALIDAS


def test_multiplas_transacoes():
    modelo = _treinar_modelo()
    df = pd.DataFrame([
        {"descricao": "Uber Trip", "valor": 32.5},
        {"descricao": "Netflix", "valor": 39.9},
        {"descricao": "Plano de Saude", "valor": 350.0},
    ])
    resultado = classificar_transacoes(df, modelo)
    assert all(cat in CATEGORIAS_VALIDAS for cat in resultado["categoria"])

