"""
pipeline_completo.py
Orquestrador do fluxo completo:
features_modelo (9 atributos, sem vazamento) -> predição de perfil -> recomendações.

IMPORTANTE: A partir da correção de Data Leakage, este módulo NÃO recebe
mais margem_sobra, comprometimento_renda, taxa_poupanca e meses_reserva
como entrada do modelo. Essas métricas são calculadas e devolvidas
separadamente pela API (main.py -> indicadoresNegocio), e repassadas
aqui apenas como parâmetros opcionais para o motor de recomendações.
"""

import joblib
import pandas as pd
from pathlib import Path

from dataset_profile import FEATURES_MODELO_PERFIL
from recomendacoes_engine import gerar_recomendacoes

MODELS_DIR = Path(__file__).parent / "models"
MODEL_PATH = MODELS_DIR / "gb_profile.pkl"
SCALER_PATH = MODELS_DIR / "scaler_profile.pkl"
ENCODER_PATH = MODELS_DIR / "label_encoder_profile.pkl"

_model = None
_scaler = None
_encoder = None


def _carregar_artefatos():
    global _model, _scaler, _encoder
    if _model is None:
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        _encoder = joblib.load(ENCODER_PATH)
    return _model, _scaler, _encoder


def _validar_features_modelo(features_modelo: dict) -> None:
    """Garante que o dict recebido tem exatamente as 9 features esperadas."""
    faltantes = [f for f in FEATURES_MODELO_PERFIL if f not in features_modelo]
    if faltantes:
        raise ValueError(f"Campos obrigatórios ausentes para o modelo: {faltantes}")

    extras = [f for f in features_modelo if f not in FEATURES_MODELO_PERFIL]
    if extras:
        raise ValueError(
            f"Campos não esperados pelo modelo (possível vazamento de dados): {extras}"
        )


def executar_pipeline(
    features_modelo: dict,
    indicadores_negocio: dict | None = None,
    resumo_gastos: dict | None = None,
) -> dict:
    """
    Executa o fluxo completo:
    1. Valida que apenas as 9 features corretas foram enviadas ao modelo.
    2. Faz a predição do perfil financeiro (Gradient Boosting).
    3. Gera recomendações usando o perfil + indicadores de negócio + resumo de gastos.

    Parameters
    ----------
    features_modelo : dict
        As 9 features reais, SEM vazamento, na mesma ordem/nomes de
        FEATURES_MODELO_PERFIL (dataset_profile.py).
    indicadores_negocio : dict | None
        margemSobra, comprometimentoRenda, taxaPoupanca, mesesReserva —
        usados apenas para enriquecer as recomendações. NÃO entram no modelo.
    resumo_gastos : dict | None
        Totais por categoria de despesa, usados para identificar a
        categoria de maior gasto nas recomendações.

    Returns
    -------
    dict com "perfil_financeiro", "probabilidade" e "recomendacoes".
    """
    _validar_features_modelo(features_modelo)

    model, scaler, encoder = _carregar_artefatos()

    df_features = pd.DataFrame([features_modelo], columns=FEATURES_MODELO_PERFIL)

    X_scaled = scaler.transform(df_features)
    pred = model.predict(X_scaled)
    proba = model.predict_proba(X_scaled)

    perfil = encoder.inverse_transform(pred)[0]
    probabilidade = round(float(proba.max()), 4)

    indicadores_negocio = indicadores_negocio or {}
    resumo_gastos = resumo_gastos or {}

    recomendacoes = gerar_recomendacoes(
        features_modelo=features_modelo,
        indicadores_negocio=indicadores_negocio,
        resumo_gastos=resumo_gastos,
        perfil_financeiro=perfil,
    )

    return {
        "perfil_financeiro": perfil,
        "probabilidade": probabilidade,
        "recomendacoes": recomendacoes,
    }


if __name__ == "__main__":
    import json

    exemplo_features = {
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
    exemplo_negocio = {
        "margemSobra": 1300.0,
        "comprometimentoRenda": 71.0,
        "taxaPoupanca": 6.7,
        "mesesReserva": 1.56,
    }
    exemplo_resumo_gastos = {
        "alimentacao": 800.0,
        "moradia": 1500.0,
        "transporte": 400.0,
        "saude": 300.0,
        "utilitarios": 200.0,
    }

    resultado = executar_pipeline(exemplo_features, exemplo_negocio, exemplo_resumo_gastos)
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
