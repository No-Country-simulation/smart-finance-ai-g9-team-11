import numpy as np
import pandas as pd

pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)

FEATURES_MODELO_PERFIL = [
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

TARGET_COLUNA = "perfil"


def _classificar_perfil_regra(renda, gastos, endividamento, poupanca_mensal,
                                reserva_financeira, meses_saldo_negativo, rng):
    """
    Classifica o perfil com base em regras de negócio, com ruído controlado
    que adicionei nas fronteiras para simular imperfeições de dados reais
    (Sprint 1).
    """
    margem = renda - gastos
    comprometimento = (gastos / renda * 100) if renda > 0 else 100
    taxa_poupanca = (poupanca_mensal / renda * 100) if renda > 0 else 0
    meses_reserva = reserva_financeira / gastos if gastos > 0 else 0

    if margem < 0 or endividamento >= 50 or meses_saldo_negativo >= 2:
        perfil = "Em risco"
    elif comprometimento <= 70 and endividamento <= 20 and taxa_poupanca >= 15 and meses_reserva >= 3:
        perfil = "Saudável"
    else:
        perfil = "Em observação"

    if rng.random() < 0.07:
        vizinhos = {
            "Em risco": ["Em observação"],
            "Em observação": ["Em risco", "Saudável"],
            "Saudável": ["Em observação"],
        }
        perfil = rng.choice(vizinhos[perfil])

    return perfil


def _separar_poupanca_e_reserva(renda_mensal, total_gastos, rng, forcar_saudavel=False):
    margem = max(renda_mensal - total_gastos, 0)
    if forcar_saudavel and margem > 0:
        poupanca_mensal = round(margem * rng.uniform(0.45, 0.7), 2)
        reserva_financeira = round(renda_mensal * rng.uniform(2.0, 5.0), 2)
    else:
        poupanca_mensal = round(margem * rng.uniform(0, 0.6), 2) if margem > 0 else 0.0
        reserva_financeira = round(renda_mensal * rng.uniform(0, 4), 2)
    return poupanca_mensal, reserva_financeira


def gerar_dataset_perfil_simulado(n_amostras: int = 1200, seed: int = 42) -> pd.DataFrame:
    """Gera o dataset simulado de perfis financeiros (Sprint 1)."""
    rng = np.random.default_rng(seed)
    registros = []

    for i in range(n_amostras):
        forcar_saudavel = i % 3 == 0

        renda_mensal = round(float(rng.uniform(1200, 15000)), 2)

        if forcar_saudavel:
            percentual_gasto = rng.uniform(0.3, 0.55)
            endividamento = round(float(rng.uniform(0, 20)), 2)
        else:
            percentual_gasto = rng.uniform(0.3, 1.3)
            endividamento = round(float(rng.uniform(0, 90)), 2)

        total_gastos = round(renda_mensal * percentual_gasto, 2)

        poupanca_mensal, reserva_financeira = _separar_poupanca_e_reserva(
            renda_mensal, total_gastos, rng, forcar_saudavel=forcar_saudavel
        )

        if forcar_saudavel:
            meses_saldo_negativo = int(rng.integers(0, 2))
        else:
            meses_saldo_negativo = int(rng.integers(0, 6)) if percentual_gasto > 1 else int(rng.integers(0, 2))

        percentual_essenciais = round(float(rng.uniform(40, 90)), 2)
        ticket_medio = round(float(rng.uniform(30, 500)), 2)
        percentual_recorrentes = round(float(rng.uniform(10, 70)), 2)

        perfil = _classificar_perfil_regra(
            renda_mensal, total_gastos, endividamento,
            poupanca_mensal, reserva_financeira, meses_saldo_negativo, rng
        )

        registros.append({
            "renda_mensal_liquida": renda_mensal,
            "despesa_total": total_gastos,
            "nivel_endividamento": endividamento,
            "poupanca_mensal": poupanca_mensal,
            "reserva_financeira": reserva_financeira,
            "meses_saldo_negativo": meses_saldo_negativo,
            "percentual_essenciais": percentual_essenciais,
            "ticket_medio": ticket_medio,
            "percentual_recorrentes": percentual_recorrentes,
            "margem_sobra": round(renda_mensal - total_gastos, 2),
            "comprometimento_renda": round((total_gastos / renda_mensal) * 100, 2),
            "taxa_poupanca": round((poupanca_mensal / renda_mensal) * 100, 2),
            "meses_reserva": round(reserva_financeira / total_gastos, 2) if total_gastos > 0 else 0.0,
            TARGET_COLUNA: perfil,
        })

    return pd.DataFrame(registros)


def obter_X_y_treino(df: pd.DataFrame):
    """Separa features (X) e target (y) para o treinamento (Sprint 2)."""
    X = df[FEATURES_MODELO_PERFIL]
    y = df[TARGET_COLUNA]
    return X, y


if __name__ == "__main__":
    df = gerar_dataset_perfil_simulado()
    print(df.head())
    print(df["perfil"].value_counts())
