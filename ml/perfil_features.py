"""
perfil_features.py
Camada de runtime: recebe a base financeira agregada (calculada pelo
módulo do Vitor) e organiza tanto o vetor de features do modelo quanto
os indicadores de negócio e o resumo de gastos por categoria.
"""

from typing import Dict, Any

import pandas as pd

from dataset_profile import FEATURES_MODELO_PERFIL


def _extrair_features_dict(base: Dict[str, Any]) -> Dict[str, Any]:
    """Monta o dict das 9 features do modelo, sem vazamento."""
    features_dict = {
        "renda_mensal_liquida": base["receita_total"],
        "despesa_total": base["despesa_total"],
        "nivel_endividamento": base["nivel_endividamento"],
        "poupanca_mensal": base["sobra"],
        "reserva_financeira": base["reserva_financeira"],
        "meses_saldo_negativo": base["meses_saldo_negativo"],
        "percentual_essenciais": base["percentual_essenciais"],
        "ticket_medio": base["ticket_medio"],
        "percentual_recorrentes": base["percentual_recorrentes"],
    }
    # Garante a ordem exata usada no treino do modelo
    return {chave: features_dict[chave] for chave in FEATURES_MODELO_PERFIL}


def montar_dataframe_features(base: Dict[str, Any]) -> pd.DataFrame:
    """DataFrame de 1 linha, na ordem exata usada no treino do modelo."""
    features_modelo = _extrair_features_dict(base)
    return pd.DataFrame([features_modelo], columns=FEATURES_MODELO_PERFIL)


def obter_indicadores_negocio(base: Dict[str, Any]) -> dict:
    """Indicadores que NÃO entram no modelo, usados no motor de recomendações."""
    return {
        "margemSobra": base["margem_sobra"],
        "comprometimentoRenda": base["comprometimento_renda"],
        "taxaPoupanca": base["taxa_poupanca"],
        "mesesReserva": base["meses_reserva"],
    }


def obter_resumo_gastos(base: Dict[str, Any]) -> dict:
    """Gastos por categoria, usados só para exibição no dashboard."""
    totais = base["totais_por_categoria"]
    return {
        "alimentacao": totais["ALIMENTACAO"],
        "moradia": totais["MORADIA"],
        "compras": totais["COMPRAS"],
        "entretenimento": totais["ENTRETENIMENTO"],
        "investimento": totais["INVESTIMENTO"],
        "saude": totais["SAUDE"],
        "transporte": totais["TRANSPORTE"],
        "utilitarios": totais["UTILITARIOS"],
        "outros": totais["OUTROS"],
    }


def preparar_features_e_indicadores(base: Dict[str, Any]) -> dict:
    """
    Retorna, de uma vez:
    - features_modelo: dict com as 9 features na ordem do treino
    - indicadores_negocio: dict com as métricas de exibição/recomendação
    - resumo_gastos: dict com os totais por categoria
    """
    return {
        "features_modelo": _extrair_features_dict(base),
        "indicadores_negocio": obter_indicadores_negocio(base),
        "resumo_gastos": obter_resumo_gastos(base),
    }
