"""
recomendacoes_engine.py
Motor de recomendações financeiras baseado em regras lógicas
(árvore de decisão determinística), usando as features do modelo
e os indicadores de negócio (com vazamento, só para regras).

Não é um modelo treinado: é lógica de negócio explícita, fácil de
justificar e auditar (requisito de explicabilidade do edital).
"""

from typing import Dict, Any, List


def gerar_recomendacoes(
    features_modelo: Dict[str, Any],
    indicadores_negocio: Dict[str, Any],
    resumo_gastos: Dict[str, Any],
    perfil_financeiro: str,
) -> List[str]:
    recomendacoes: List[str] = []

    endividamento = features_modelo["nivel_endividamento"]
    poupanca = features_modelo["poupanca_mensal"]
    reserva = features_modelo["reserva_financeira"]
    meses_saldo_negativo = features_modelo["meses_saldo_negativo"]
    percentual_essenciais = features_modelo["percentual_essenciais"]
    percentual_recorrentes = features_modelo["percentual_recorrentes"]
    despesa_total = features_modelo["despesa_total"]
    renda = features_modelo["renda_mensal_liquida"]

    taxa_poupanca = indicadores_negocio["taxaPoupanca"]
    meses_reserva = indicadores_negocio["mesesReserva"]
    comprometimento_renda = indicadores_negocio["comprometimentoRenda"]

    # --- Regras: Endividamento ---
    if endividamento >= 50:
        recomendacoes.append(
            "Priorizar a renegociação de dívidas: nível de endividamento acima de 50% da renda."
        )
    elif endividamento >= 30:
        recomendacoes.append(
            "Reduzir o uso de crédito: endividamento entre 30% e 50% da renda merece atenção."
        )

    # --- Regras: Comprometimento de renda ---
    if comprometimento_renda >= 90:
        recomendacoes.append(
            "Revisar despesas com urgência: quase toda a renda está sendo consumida por gastos mensais."
        )
    elif comprometimento_renda >= 70:
        recomendacoes.append(
            "Buscar reduzir despesas fixas para aumentar a margem de sobra mensal."
        )

    # --- Regras: Poupança ---
    if poupanca <= 0:
        recomendacoes.append(
            "Criar um orçamento mensal para evitar gastos acima da renda disponível."
        )
    elif taxa_poupanca < 10:
        recomendacoes.append(
            "Aumentar a frequência de poupança: taxa atual está abaixo de 10% da renda."
        )

    # --- Regras: Reserva de emergência ---
    if meses_reserva < 1:
        recomendacoes.append(
            "Construir uma reserva de emergência: cobertura atual é inferior a 1 mês de despesas."
        )
    elif meses_reserva < 3:
        recomendacoes.append(
            "Fortalecer a reserva financeira até atingir o equivalente a 3 meses de despesas."
        )

    # --- Regras: Saldo negativo recorrente ---
    if meses_saldo_negativo > 0:
        recomendacoes.append(
            "Identificar e cortar despesas não essenciais para reverter o saldo negativo mensal."
        )

    # --- Regras: Composição de gastos ---
    if percentual_essenciais > 80:
        recomendacoes.append(
            "Buscar alternativas mais econômicas para despesas essenciais (moradia, alimentação, saúde)."
        )

    if percentual_recorrentes > 40:
        recomendacoes.append(
            "Revisar assinaturas e contas recorrentes: elas representam uma parcela alta das despesas."
        )

    # --- Regras: Categoria de maior gasto (resumo_gastos) ---
    if resumo_gastos:
        categoria_maior_gasto = max(resumo_gastos, key=resumo_gastos.get)
        valor_maior_gasto = resumo_gastos[categoria_maior_gasto]
        if despesa_total > 0 and (valor_maior_gasto / despesa_total) > 0.35:
            recomendacoes.append(
                f"Monitorar gastos com {categoria_maior_gasto}: representa mais de 35% das despesas totais."
            )

    # --- Regras específicas por perfil ---
    if perfil_financeiro == "Saudável" and not recomendacoes:
        recomendacoes.append(
            "Perfil financeiro saudável: considere investir a sobra mensal para fazer o dinheiro trabalhar por você."
        )

    if perfil_financeiro == "Em risco" and endividamento < 30 and comprometimento_renda < 70:
        # Caso raro: classificado em risco por outros fatores do modelo
        recomendacoes.append(
            "Reavaliar hábitos financeiros gerais: o perfil indica risco mesmo com endividamento controlado."
        )

    # --- Fallback ---
    if not recomendacoes:
        recomendacoes.append(
            "Manter o acompanhamento mensal das finanças para preservar a saúde financeira atual."
        )

    return recomendacoes
