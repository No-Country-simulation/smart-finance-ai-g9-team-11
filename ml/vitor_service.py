"""
vitor_service.py
Classificação de transações (NLP) + agregação financeira.
"""

from typing import List, Dict, Any

from ml.scripts.algorithm1.predict import predizer_categoria


class VitorPayloadError(Exception):
    """Erro de validação/payload relacionado ao módulo do Vitor."""
    pass


# ============================================================
# 1. CLASSIFICAÇÃO DE TEXTO (NLP)
# ============================================================

MAPA_CATEGORIAS = {
    "ALIMENTACAO": "ALIMENTACAO",
    "MORADIA": "MORADIA",
    "COMPRAS": "COMPRAS",
    "ENTRETENIMENTO": "ENTRETENIMENTO",
    "INVESTIMENTO": "INVESTIMENTO",
    "SALARIO": "SALARIO",
    "SAUDE": "SAUDE",
    "TRANSPORTE": "TRANSPORTE",
    "UTILITARIOS": "UTILITARIOS",
    "OUTROS": "OUTROS",
}


def classificar_transacao(description: str, amount: float, tipo: str) -> str:
    if not description or not isinstance(description, str):
        raise VitorPayloadError("Descrição da transação inválida.")

    categoria_predita = predizer_categoria(description)
    return MAPA_CATEGORIAS.get(categoria_predita, "OUTROS")


# ============================================================
# 2. AGREGAÇÃO FINANCEIRA
# ============================================================

_ESSENCIAIS = {"MORADIA", "ALIMENTACAO", "SAUDE", "TRANSPORTE", "UTILITARIOS"}
_RECORRENTES = {"MORADIA", "UTILITARIOS", "SAUDE"}


def calcular_indicadores_financeiros(
    transacoes: List[Dict[str, Any]], nivel_endividamento: float
) -> Dict[str, Any]:
    if not transacoes:
        raise VitorPayloadError("Lista de transações vazia.")

    categorias = [
        "ALIMENTACAO", "MORADIA", "COMPRAS", "ENTRETENIMENTO",
        "INVESTIMENTO", "SAUDE", "TRANSPORTE", "UTILITARIOS", "OUTROS",
    ]
    totais = {c: 0.0 for c in categorias}

    receita_total = 0.0
    despesa_total = 0.0
    qtd_despesas = 0
    essenciais_total = 0.0
    recorrentes_total = 0.0

    for t in transacoes:
        categoria = t.get("category")
        amount = float(t.get("amount", 0.0))
        tipo = t.get("type")

        if tipo == "RECEITA":
            receita_total += amount
        elif tipo == "DESPESA":
            despesa_total += amount
            qtd_despesas += 1

            if categoria in totais:
                totais[categoria] += amount
            else:
                categoria = "OUTROS"
                totais["OUTROS"] += amount

            if categoria in _ESSENCIAIS:
                essenciais_total += amount
            if categoria in _RECORRENTES:
                recorrentes_total += amount

    if receita_total <= 0:
        raise VitorPayloadError("Receita total deve ser maior que zero.")

    sobra = receita_total - despesa_total
    margem_sobra = (sobra / receita_total) * 100
    comprometimento_renda = (despesa_total / receita_total) * 100
    taxa_poupanca = max(margem_sobra, 0.0)
    meses_reserva = (sobra / despesa_total) if despesa_total > 0 else 0.0

    percentual_essenciais = (essenciais_total / despesa_total * 100) if despesa_total > 0 else 0.0
    percentual_recorrentes = (recorrentes_total / despesa_total * 100) if despesa_total > 0 else 0.0
    ticket_medio = (despesa_total / qtd_despesas) if qtd_despesas > 0 else 0.0

    meses_saldo_negativo = 0 if sobra >= 0 else 1
    reserva_financeira = max(sobra, 0.0)  # ⚠️ pendente de decisão com o Vitor

    return {
        "receita_total": receita_total,
        "despesa_total": despesa_total,
        "sobra": sobra,
        "nivel_endividamento": nivel_endividamento,
        "totais_por_categoria": totais,
        "margem_sobra": margem_sobra,
        "comprometimento_renda": comprometimento_renda,
        "taxa_poupanca": taxa_poupanca,
        "meses_reserva": max(meses_reserva, 0.0),
        "percentual_essenciais": percentual_essenciais,
        "percentual_recorrentes": percentual_recorrentes,
        "ticket_medio": ticket_medio,
        "meses_saldo_negativo": meses_saldo_negativo,
        "reserva_financeira": reserva_financeira,
    }
