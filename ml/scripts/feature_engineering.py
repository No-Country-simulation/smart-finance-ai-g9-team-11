import pandas as pd

def calcular_frequencia_poupanca(taxa_poupanca: float) -> str:
    if taxa_poupanca <= 0:
        return "Nenhuma"
    elif taxa_poupanca < 15:
        return "Baixa"
    elif taxa_poupanca < 30:
        return "Média"
    else:
        return "Alta"

def extrair_features(df: pd.DataFrame) -> dict:
    # 1. Pré-processamento e garantia do tipo datetime
    df = df.copy()
    if not pd.api.types.is_datetime64_any_dtype(df["Date"]):
        df["Date"] = pd.to_datetime(df["Date"], format="mixed", dayfirst=False)

    # 2. Receita e despesas totais
    renda_total = df.loc[df["Type"] == "Receita", "Amount"].sum()
    despesa_total = df.loc[df["Type"] == "Despesa", "Amount"].sum()

    # Despesas operacionais/consumo (exclui Investimento para não inflar o endividamento)
    despesa_consumo = df.loc[
        (df["Type"] == "Despesa") & (~df["Category"].isin(["Investimento"])),
        "Amount"
    ].sum()

    # Médias mensais
    renda_mensal = (
        df[df["Type"] == "Receita"]
        .groupby(df["Date"].dt.to_period("M"))["Amount"]
        .sum()
        .mean()
        if not df[df["Type"] == "Receita"].empty
        else 0.0
    )

    despesa_mensal = (
        df[df["Type"] == "Despesa"]
        .groupby(df["Date"].dt.to_period("M"))["Amount"]
        .sum()
        .mean()
        if not df[df["Type"] == "Despesa"].empty
        else 0.0
    )

    # 3. Indicadores financeiros
    poupanca_mensal = renda_mensal - despesa_mensal
    margem_sobra = renda_mensal - despesa_mensal

    # Nível de endividamento calculado com base no consumo real (sem investimentos)
    nivel_endividamento = (
        (despesa_consumo / renda_total) * 100 if renda_total > 0 else 0.0
    )

    comprometimento_renda = (
        (despesa_mensal / renda_mensal) * 100 if renda_mensal > 0 else 0.0
    )

    taxa_poupanca = (
        (poupanca_mensal / renda_mensal) * 100 if renda_mensal > 0 else 0.0
    )

    # 4. Reserva financeira
    reserva_financeira = max(0.0, renda_total - despesa_total)

    meses_reserva = (
        reserva_financeira / despesa_mensal if despesa_mensal > 0 else 0.0
    )

    # 5. Meses com saldo negativo
    saldo_mensal = (
        df.groupby([df["Date"].dt.to_period("M"), "Type"])["Amount"]
        .sum()
        .unstack(fill_value=0)
    )

    if "Receita" not in saldo_mensal.columns:
        saldo_mensal["Receita"] = 0.0
    if "Despesa" not in saldo_mensal.columns:
        saldo_mensal["Despesa"] = 0.0

    saldo_mensal["saldo"] = saldo_mensal["Receita"] - saldo_mensal["Despesa"]
    meses_saldo_negativo = int((saldo_mensal["saldo"] < 0).sum())

    # 6. Gastos essenciais (Ajustado: "Moradia" em vez de "Aluguel")
    essenciais = ["Alimentação", "Moradia", "Utilitários", "Saúde", "Trajeto"]

    gasto_essenciais = df[
        (df["Category"].isin(essenciais)) & (df["Type"] == "Despesa")
    ]["Amount"].sum()

    percentual_essenciais = (
        (gasto_essenciais / despesa_total) * 100 if despesa_total > 0 else 0.0
    )

    # 7. Ticket médio
    despesas_df = df[df["Type"] == "Despesa"]
    ticket_medio = (
        despesas_df["Amount"].mean() if not despesas_df.empty else 0.0
    )

    # 8. Gastos recorrentes
    recorrentes = df["Transaction Description"].value_counts()
    descricoes_recorrentes = recorrentes[recorrentes > 1].index

    valor_recorrente = df[
        df["Transaction Description"].isin(descricoes_recorrentes)
    ]["Amount"].sum()

    percentual_recorrentes = (
        (valor_recorrente / despesa_total) * 100 if despesa_total > 0 else 0.0
    )

    # 9. Features exatas esperadas pelo pipeline do modelo
    features_modelo = {
        "renda_mensal_liquida": round(float(renda_mensal), 2),
        "despesa_total": round(float(despesa_total), 2),
        "nivel_endividamento": round(float(nivel_endividamento), 2),
        "poupanca_mensal": round(float(poupanca_mensal), 2),
        "reserva_financeira": round(float(reserva_financeira), 2),
        "meses_saldo_negativo": int(meses_saldo_negativo),
        "percentual_essenciais": round(float(percentual_essenciais), 2),
        "ticket_medio": round(float(ticket_medio), 2),
        "percentual_recorrentes": round(float(percentual_recorrentes), 2),
    }

    # 10. Mapeamento de gastos por categoria 
    categorias_map = {
        "alimentacao": ["Alimentação", "Restaurante", "Mercado"],
        "moradia": ["Moradia", "Aluguel", "Condomínio"],
        "compras": ["Compras", "Vestuário", "Eletrônicos"],
        "entretenimento": ["Entretenimento", "Lazer", "Cinema"],
        "investimento": ["Investimento", "Aplicações"],
        "saude": ["Saúde", "Farmácia", "Hospital"],
        "transporte": ["Transporte", "Trajeto", "Combustível", "Uber"],
        "utilitarios": ["Utilitários", "Luz", "Água", "Internet"],
    }

    resumo_gastos = {}
    categorias_mapeadas = []

    for chave, categorias in categorias_map.items():
        val = df.loc[
            (df["Category"].isin(categorias)) & (df["Type"] == "Despesa"),
            "Amount",
        ].sum()
        resumo_gastos[chave] = round(float(val), 2)
        categorias_mapeadas.extend(categorias)

    # Captura despesas de categorias não listadas em "outros"
    resumo_gastos["outros"] = round(
        float(
            df.loc[
                (~df["Category"].isin(categorias_mapeadas))
                & (df["Type"] == "Despesa"),
                "Amount",
            ].sum()
        ),
        2,
    )

    # 11. Retorno estruturado para o pipeline_completo.py
    return {
        "features_modelo": features_modelo,
        "indicadores_negocio": {
            "margemSobra": round(float(margem_sobra), 2),
            "comprometimentoRenda": round(float(comprometimento_renda), 2),
            "taxaPoupanca": round(float(taxa_poupanca), 2),
            "mesesReserva": round(float(meses_reserva), 2),
        },
        "resumo_gastos": resumo_gastos,
    }