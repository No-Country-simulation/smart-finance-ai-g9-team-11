"""
Camada de runtime: recebe o payload do Vitor, valida e organiza tanto
o vetor de features do modelo quanto os indicadores de negócio.
"""

import pandas as pd

from dataset_profile import FEATURES_MODELO_PERFIL
from vitor_interface import validar_payload


def montar_dataframe_features(payload_vitor: dict) -> pd.DataFrame:
    """DataFrame de 1 linha, na ordem exata usada no treino do modelo."""
    resultado = validar_payload(payload_vitor)
    return pd.DataFrame([resultado["modelo"]], columns=FEATURES_MODELO_PERFIL)


def obter_indicadores_negocio(payload_vitor: dict) -> dict:
    """Indicadores que NÃO entram no modelo, usados no motor de recomendações."""
    resultado = validar_payload(payload_vitor)
    return resultado["negocio"]


def obter_resumo_gastos(payload_vitor: dict) -> dict:
    """Gastos por categoria, usados só para exibição no dashboard."""
    resultado = validar_payload(payload_vitor)
    return resultado["resumo_gastos"]


def preparar_features_e_indicadores(payload_vitor: dict) -> dict:
    """
    Retorna, de uma vez:
    - df_features: DataFrame pronto para o modelo
    - indicadores_negocio: dict
