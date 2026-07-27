import pandas as pd

def extrair_features(df: pd.DataFrame) -> pd.DataFrame:

    # Pré-processamento
    df = df.copy()
    df["Date"] = pd.to_datetime(df["Date"])

    # Número de meses presentes no histórico
    num_meses = df["Date"].dt.to_period("M").nunique()

    # Receita e despesas

    renda_total = df.loc[df["Type"] == "Receita", "Amount"].sum()

    despesa_total = df.loc[df["Type"] == "Despesa", "Amount"].sum()

    renda_mensal = (
        df[df["Type"] == "Receita"]
        .groupby(df["Date"].dt.to_period("M"))["Amount"]
        .sum()
        .mean()
    )

    despesa_mensal = (
        df[df["Type"] == "Despesa"]
        .groupby(df["Date"].dt.to_period("M"))["Amount"]
        .sum()
        .mean()
    )

    # Indicadores financeiros

    poupanca_mensal = renda_mensal - despesa_mensal

    margem_sobra = renda_mensal - despesa_mensal

    nivel_endividamento = (
        (despesa_total / renda_total) * 100
        if renda_total > 0 else 0
    )

    comprometimento_renda = (
        (despesa_mensal / renda_mensal) * 100
        if renda_mensal > 0 else 0
    )

    taxa_poupanca = (
        (poupanca_mensal / renda_mensal) * 100
        if renda_mensal > 0 else 0
    )

    # Reserva financeira

    reserva_financeira = max(0, renda_total - despesa_total)

    meses_reserva = (
        reserva_financeira / despesa_mensal
        if despesa_mensal > 0 else 0
    )

    # Meses com saldo negativo

    saldo_mensal = (
        df.groupby([df["Date"].dt.to_period("M"), "Type"])["Amount"]
        .sum()
        .unstack(fill_value=0)
    )

    saldo_mensal["saldo"] = (
        saldo_mensal["Receita"] -
        saldo_mensal["Despesa"]
    )

    meses_saldo_negativo = (
        saldo_mensal["saldo"] < 0
    ).sum()

    # Gastos essenciais

    essenciais = [
        "Alimentação",
        "Aluguel",
        "Utilitários",
        "Saúde",
        "Trajeto"
    ]

    gasto_essenciais = df[
        (df["Category"].isin(essenciais)) &
        (df["Type"] == "Despesa")
    ]["Amount"].sum()

    percentual_essenciais = (
        (gasto_essenciais / despesa_total) * 100
        if despesa_total > 0 else 0
    )

    # Ticket médio

    ticket_medio = (
        df[df["Type"] == "Despesa"]["Amount"]
        .mean()
    )

    # Gastos recorrentes

    recorrentes = df["Transaction Description"].value_counts()

    descricoes_recorrentes = (
        recorrentes[recorrentes > 1]
        .index
    )

    valor_recorrente = df[
        df["Transaction Description"]
        .isin(descricoes_recorrentes)
    ]["Amount"].sum()

    percentual_recorrentes = (
        (valor_recorrente / despesa_total) * 100
        if despesa_total > 0 else 0
    )

    # Resumo de gastos por categoria

    resumo_gastos = (
        df[df["Type"] == "Despesa"]
        .groupby("Category")["Amount"]
        .sum()
        .to_dict()
    )

    # DataFrame final de features
    
    features = pd.DataFrame([{
        "renda_mensal": round(renda_mensal, 2),
        "despesa_total": round(despesa_total, 2),
        "nivel_endividamento": round(nivel_endividamento, 2),
        "poupanca_mensal": round(poupanca_mensal, 2),
        "reserva_financeira": round(reserva_financeira, 2),
        "meses_saldo_negativo": int(meses_saldo_negativo),
        "percentual_essenciais": round(percentual_essenciais, 2),
        "ticket_medio": round(ticket_medio, 2),
        "percentual_recorrentes": round(percentual_recorrentes, 2),
        "margem_sobra": round(margem_sobra, 2),
        "comprometimento_renda": round(comprometimento_renda, 2),
        "taxa_poupanca": round(taxa_poupanca, 2),
        "meses_reserva": round(meses_reserva, 2)
    }])

    return features