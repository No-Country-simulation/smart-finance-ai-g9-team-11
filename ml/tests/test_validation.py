import pytest
from ml.scripts.validation import validar_e_limpar_transacoes, ErroValidacaoTransacoes


def test_remove_transacoes_com_valor_negativo():
    transacoes = [
        {"descricao": "Mercado", "valor": -50.0},
        {"descricao": "Salario", "valor": 4500.0},
    ]
    df_validas, rejeitadas = validar_e_limpar_transacoes(transacoes)
    assert (df_validas["valor"] > 0).all()
    assert len(rejeitadas) == 1


def test_remove_duplicatas():
    transacoes = [
        {"descricao": "Mercado", "valor": 100.0},
        {"descricao": "Mercado", "valor": 100.0},
    ]
    df_validas, _ = validar_e_limpar_transacoes(transacoes)
    assert len(df_validas) == 1


def test_remove_descricao_vazia():
    transacoes = [
        {"descricao": "", "valor": 30.0},
        {"descricao": "Farmacia", "valor": 45.0},
    ]
    df_validas, rejeitadas = validar_e_limpar_transacoes(transacoes)
    assert len(df_validas) == 1
    assert df_validas.iloc[0]["descricao"] == "Farmacia"
    assert len(rejeitadas) == 1


def test_lista_vazia_lanca_erro():
    with pytest.raises(ErroValidacaoTransacoes):
        validar_e_limpar_transacoes([])


def test_todas_invalidas_lanca_erro():
    transacoes = [{"descricao": "", "valor": -10}]
    with pytest.raises(ErroValidacaoTransacoes):
        validar_e_limpar_transacoes(transacoes)

