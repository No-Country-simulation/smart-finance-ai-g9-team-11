"""
scoring.py
Calcula o score de saÃºde financeira (0-100) e o nÃ­vel de risco,
combinando o resultado do Algoritmo 2 com os indicadores financeiros.
"""

MAPA_RISCO = {
    "saudavel": "baixo",
    "em_observacao": "moderado",
    "em_risco": "alto",
}


def calcular_score_saude_financeira(indicadores: dict, resultado_perfil: dict) -> dict:
    """
    Score ponderado (0-100) considerando:
    - comprometimento da renda (peso 35%)
    - taxa de poupanÃ§a (peso 25%)
    - meses de reserva (peso 20%)
    - nÃ­vel de endividamento (peso 20%)
    """
    comprometimento = min(indicadores.get("comprometimento_renda", 100), 150)
    taxa_poupanca = indicadores.get("taxa_poupanca", 0)
    meses_reserva = min(indicadores.get("meses_reserva", 0), 12)
    endividamento = indicadores.get("nivel_endividamento", 0)

    nota_comprometimento = max(0, 100 - comprometimento) * 0.35
    nota_poupanca = min(taxa_poupanca, 30) / 30 * 100 * 0.25
    nota_reserva = min(meses_reserva, 6) / 6 * 100 * 0.20
    nota_endividamento = max(0, 100 - endividamento) * 0.20

    score = round(nota_comprometimento + nota_poupanca + nota_reserva + nota_endividamento, 0)
    score = int(max(0, min(100, score)))

    perfil = resultado_perfil["perfil_financeiro"]
    nivel_risco = MAPA_RISCO.get(perfil, "moderado")

    return {
        "score_saude_financeira": score,
        "nivel_risco": nivel_risco,
    }


