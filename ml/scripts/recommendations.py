"""
recommendations.py
Motor de recomendaÃ§Ãµes financeiras: frase principal + bullet points,
conforme especificado no fluxograma.
"""


def gerar_recomendacoes_financeiras(perfil_financeiro: str, indicadores: dict,
                                      score_info: dict) -> dict:
    nivel_risco = score_info["nivel_risco"]

    frases_por_risco = {
        "baixo": "Sua situaÃ§Ã£o financeira estÃ¡ saudÃ¡vel.",
        "moderado": "Sua situaÃ§Ã£o financeira exige atenÃ§Ã£o moderada.",
        "alto": "Sua situaÃ§Ã£o financeira exige atenÃ§Ã£o imediata.",
    }
    frase_principal = frases_por_risco.get(nivel_risco, "Revise seus hÃ¡bitos financeiros.")

    bullet_points = []

    comprometimento = indicadores.get("comprometimento_renda", 0)
    taxa_poupanca = indicadores.get("taxa_poupanca", 0)
    meses_reserva = indicadores.get("meses_reserva", 0)
    endividamento = indicadores.get("nivel_endividamento", 0)
    categoria_dominante = indicadores.get("categoria_dominante")

    if comprometimento > 70:
        bullet_points.append("Reduza gastos nÃ£o essenciais em pelo menos 10%.")

    if endividamento >= 40:
        bullet_points.append("Priorize o pagamento de dÃ­vidas com juros elevados.")

    if taxa_poupanca < 15:
        bullet_points.append("Aumente gradualmente sua reserva mensal.")

    if meses_reserva < 3:
        bullet_points.append("Construa uma reserva de emergÃªncia equivalente a 3 meses de despesas.")

    if categoria_dominante:
        bullet_points.append(f"Revise despesas recorrentes na categoria '{categoria_dominante}'.")

    if not bullet_points:
        bullet_points.append("Continue mantendo o controle financeiro atual e considere investir o excedente.")

    return {
        "frase_principal": frase_principal,
        "bullet_points": bullet_points,
    }


