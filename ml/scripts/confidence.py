"""
confidence.py
Regra de negÃ³cio de confianÃ§a da classificaÃ§Ã£o (definida no fluxograma):

Probabilidade >= 70%        -> classificaÃ§Ã£o aceita
Probabilidade entre 50-69%  -> aceita, porÃ©m marcada como "baixa confianÃ§a"
Probabilidade < 50%         -> categoria reclassificada como "outras" e marcada para revisÃ£o
"""

LIMIAR_ALTA_CONFIANCA = 0.70
LIMIAR_BAIXA_CONFIANCA = 0.50


def aplicar_regra_confianca(categoria_prevista: str, probabilidade: float) -> dict:
    if probabilidade >= LIMIAR_ALTA_CONFIANCA:
        return {
            "categoria": categoria_prevista,
            "nivel_confianca": "alta",
            "necessita_revisao": False,
        }

    if probabilidade >= LIMIAR_BAIXA_CONFIANCA:
        return {
            "categoria": categoria_prevista,
            "nivel_confianca": "baixa",
            "necessita_revisao": False,
        }

    return {
        "categoria": "outras",
        "nivel_confianca": "muito_baixa",
        "necessita_revisao": True,
    }


