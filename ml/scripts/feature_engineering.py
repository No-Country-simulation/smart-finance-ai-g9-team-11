"""
feature_engineering.py
ENGENHARIA DE INDICADORES (entre o Algoritmo 1 e o Algoritmo 2).

Transforma transaÃ§Ãµes categorizadas + dados financeiros do usuÃ¡rio
em indicadores agregados que alimentam o Algoritmo 2.
"""

import pandas as pd


def calcular_indicadores_financeiros(df_transacoes_categorizadas: pd.DataFrame,
                                       dados_financeiros: dict) -> dict:
    df = df_transacoes_categorizadas.copy()

    renda_mensal_liquida = float(dados_financeiros["renda_mensal"])
    endividamento = float(dados_financeiros.get("nivel_endividamento", 0))
    poupanca_mensal = float(dados_financeiros.get("poupanca_mensal", 0))
    reserva_financeira = float(dados_financeiros.get("reserva_financeira", 0))
    meses_saldo_negativo = int(dados_financeiros.get("meses_saldo_negativo", 0))

    # despesa total e por categoria
    despesa_total = round(float(df["valor"].sum()), 2)
    gasto_por_categoria = df.groupby("categoria")["valor"].sum().round(2).to_dict()

    # ticket mÃ©dio
    ticket_medio = round(float(df["valor"].mean()), 2) if len(df) > 0 else 0.0

    # categoria dominante
    categoria_dominante = max(gasto_por_categoria, key=gasto_por_categoria.get) if gasto_por_categoria else None

    # gastos recorrentes (se a coluna existir)
    if "recorrente" in df.columns:
        gastos_recorrentes = round(float(df[df["recorrente"] == True]["valor"].sum()), 2)
    else:
        gastos_recorrentes = 0.0

    # indicadores financeiros principais
    margem_sobra = round(renda_mensal_liquida - despesa_total, 2)
    percentual_sobra = round((margem_sobra / renda_mensal_liquida) * 100, 2) if renda_mensal_liquida > 0 else 0.0
    comprometimento_renda = round((despesa_total / renda_mensal_liquida) * 100, 2) if renda_mensal_liquida > 0 else 100.0
    taxa_poupanca = round((poupanca_mensal / renda_mensal_liquida) * 100, 2) if renda_mensal_liquida > 0 else 0.0
    meses_reserva = round(reserva_financeira / despesa_total, 2) if despesa_total > 0 else 0.0

    # ranking Top 5 categorias
    ranking_gastos = []
    ranking_ordenado = sorted(gasto_por_categoria.items(), key=lambda x: x[1], reverse=True)[:5]
    for posicao, (categoria, valor) in enumerate(ranking_ordenado, start=1):
        percentual = round((valor / despesa_total) * 100, 2) if despesa_total > 0 else 0.0
        ranking_gastos.append({
            "posicao": posicao, "categoria": categoria,
            "valor": round(valor, 2), "percentual": percentual,
        })

    return {
        "renda_mensal_liquida": round(renda_mensal_liquida, 2),
        "despesa_total": despesa_total,
        "margem_sobra": margem_sobra,
        "percentual_sobra": percentual_sobra,
        "comprometimento_renda": comprometimento_renda,
        "taxa_poupanca": taxa_poupanca,
        "meses_reserva": meses_reserva,
        "nivel_endividamento": endividamento,
        "meses_saldo_negativo": meses_saldo_negativo,
        "ticket_medio": ticket_medio,
        "categoria_dominante": categoria_dominante,
        "gastos_recorrentes": gastos_recorrentes,
        "gasto_por_categoria": gasto_por_categoria,
        "ranking_gastos": ranking_gastos,
    }


