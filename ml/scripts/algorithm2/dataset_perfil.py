"""
dataset_perfil.py
GeraÃ§Ã£o do dataset sintÃ©tico de perfis financeiros, com poupanÃ§a e reserva
coerentes com a margem real (renda - gastos).
"""

import numpy as np
import pandas as pd


def _classificar_perfil_regra(renda, gastos, endividamento, poupanca_mensal,
                                reserva_financeira, meses_saldo_negativo):
    margem = renda - gastos
    comprometimento = (gastos / renda * 100) if renda > 0 else 100
    taxa_poupanca = (poupanca_mensal / renda * 100) if renda > 0 else 0
    meses_reserva = reserva_financeira / gastos if gastos > 0 else 0

    if margem < 0 or endividamento >= 50 or meses_saldo_negativo >= 2:
        return "em_risco"

    if comprometimento <= 70 and endividamento <= 20 and taxa_poupanca >= 15 and meses_reserva >= 3:
        return "saudavel"

    return "em_observacao"


def _separar_poupanca_e_reserva(renda_mensal, total_gastos, rng):
    margem = max(renda_mensal - total_gastos, 0)
    poupanca_mensal = round(margem * rng.uniform(0, 0.6), 2) if margem > 0 else 0.0
    reserva_financeira = round(renda_mensal * rng.uniform(0, 4), 2)
    return poupanca_mensal, reserva_financeira


def gerar_dataset_perfil_simulado(n_amostras: int = 1200, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    registros = []

    for _ in range(n_amostras):
        renda_mensal = round(float(rng.uniform(1200, 15000)), 2)
        percentual_gasto = rng.uniform(0.3, 1.3)
        total_gastos = round(renda_mensal * percentual_gasto, 2)
        endividamento = round(float(rng.uniform(0, 90)), 2)

        poupanca_mensal, reserva_financeira = _separar_poupanca_e_reserva(renda_mensal, total_gastos, rng)
        meses_saldo_negativo = int(rng.integers(0, 6)) if percentual_gasto > 1 else int(rng.integers(0, 2))

        percentual_essenciais = round(float(rng.uniform(40, 90)), 2)
        ticket_medio = round(float(rng.uniform(30, 500)), 2)
        percentual_recorrentes = round(float(rng.uniform(10, 70)), 2)

        perfil = _classificar_perfil_regra(
            renda_mensal, total_gastos, endividamento,
            poupanca_mensal, reserva_financeira, meses_saldo_negativo
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
            "perfil": perfil,
        })

    return pd.DataFrame(registros)


