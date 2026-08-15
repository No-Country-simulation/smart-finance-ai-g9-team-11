import joblib
import pandas as pd
from pathlib import Path

MODELS_DIR = Path(__file__).resolve().parents[2] / "models"
MODEL_PATH = MODELS_DIR / "gb_profile.pkl"
SCALER_PATH = MODELS_DIR / "scaler_profile.pkl"
ENCODER_PATH = MODELS_DIR / "label_encoder_profile.pkl"

FEATURES = [
    "renda_mensal_liquida",
    "despesa_total",
    "nivel_endividamento",
    "poupanca_mensal",
    "reserva_financeira",
    "meses_saldo_negativo",
    "percentual_essenciais",
    "ticket_medio",
    "percentual_recorrentes",
]

def carregar_artefatos():
    """Carrega modelo, scaler e label encoder salvos em disco."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Modelo não encontrado em: {MODEL_PATH}")
    if not SCALER_PATH.exists():
        raise FileNotFoundError(f"Scaler não encontrado em: {SCALER_PATH}")
    if not ENCODER_PATH.exists():
        raise FileNotFoundError(f"Encoder não encontrado em: {ENCODER_PATH}")

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    encoder = joblib.load(ENCODER_PATH)
    return model, scaler, encoder


def validar_entrada(dados: dict) -> None:
    """Garante que todas as features obrigatórias estão presentes e são numéricas."""
    faltantes = [f for f in FEATURES if f not in dados]
    if faltantes:
        raise ValueError(f"Campos obrigatórios faltando: {faltantes}")

    for f in FEATURES:
        valor = dados[f]
        if not isinstance(valor, (int, float)):
            raise ValueError(f"Campo '{f}' deve ser numérico. Valor recebido: {valor}")


def prever_perfil(dados: dict) -> dict:
    """
    dados: dicionário com as chaves definidas em FEATURES
    Retorna o perfil financeiro previsto e a probabilidade da classe.
    """
    validar_entrada(dados)

    model, scaler, encoder = carregar_artefatos()

    df_input = pd.DataFrame([dados], columns=FEATURES)
    df_input_scaled = scaler.transform(df_input)

    pred_encoded = model.predict(df_input_scaled)[0]
    proba = model.predict_proba(df_input_scaled)[0]

    perfil = encoder.inverse_transform([pred_encoded])[0]
    probabilidade = round(float(max(proba)), 2)

    return {
        "perfil_financeiro": perfil,
        "probabilidade": probabilidade,
    }

if __name__ == "__main__":
    exemplo = {
        "renda_mensal_liquida": 4500,
        "despesa_total": 4000,
        "nivel_endividamento": 0.35,
        "poupanca_mensal": 200,
        "reserva_financeira": 1500,
        "meses_saldo_negativo": 1,
        "percentual_essenciais": 0.55,
        "ticket_medio": 120,
        "percentual_recorrentes": 0.20,
    }

    resultado = prever_perfil(exemplo)
    print(resultado)
