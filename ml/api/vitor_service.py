"""
vitor_service.py
Módulo responsável por:
1. Classificar o texto/descrição de uma transação em categoria (NLP).
2. Calcular a base financeira agregada a partir das transações.

Módulo de integração provisório. Quando o código definitivo do Vitor
(TF-IDF + Random Forest) estiver disponível, substitua a lógica interna,
mantendo as mesmas assinaturas para não quebrar o main.py.
"""

from typing import List, Dict, Any


class VitorPayloadError(Exception):
    """Erro de validação/payload relacionado ao módulo do Vitor."""
    pass


# ============================================================
# 1. CLASSIFICAÇÃO DE TEXTO (NLP)
# ============================================================

_KEYWORDS = {
    "ALIMENTACAO": ["restaurante", "mercado", "ifood", "lanchonete", "padaria", "supermercado"],
    "MORADIA": ["aluguel", "condominio", "iptu", "energia", "agua", "gas"],
    "COMPRAS": ["loja", "shopping", "compra", "magazine", "amazon"],
    "ENTRETENIMENTO": ["cinema", "netflix", "spotify", "show", "bar", "streaming"],
    "INVESTIMENTO": ["tesouro", "cdb", "acao", "acoes", "fii", "investimento", "corretora"],
    "SALARIO": ["salario", "pagamento", "holerite", "provento"],
    "SAUDE": ["farmacia", "hospital", "clinica", "plano de saude", "consulta", "remedio"],
    "TRANSPORTE": ["uber", "combustivel", "gasolina", "onibus", "metro", "99", "posto"],
    "UTILITARIOS": ["internet", "telefone", "celular", "assinatura", "conta de luz"],
}


def classificar_transacao(description: str, amount: float, tipo: str) -> str:
    if not description or not isinstance(description, str):
        raise VitorPayloadError("Descrição da transação inválida.")

    texto = description.lower()

    if tipo == "RECEITA":
        if "investimento" in texto or "dividendo" in texto or "rendimento" in texto:
            return "INVESTIMENTO"
        return "SALARIO"

    for categoria, palavras in _KEYWORDS.items():
        if any(p in texto for p in palavras):
            return categoria

    return "OUTROS"


# ============================================================
# 2. AGREGAÇÃO FINANCEIRA
# ============================================================

_ESSENCIAIS = {"MORADIA", "ALIMENTACAO", "SAUDE", "TRANSPORTE", "UTILITARIOS"}
_RECORRENTES = {"MORADIA", "UTILITARIOS", "SAUDE"}


def calcular_indicadores_financeiros(
    transacoes: List[Dict[str, Any]], nivel_endividamento: float
) -> Dict[str, Any]:
    """
    Agrega as transações classificadas em totais por categoria,
    receita total, despesa total e métricas financeiras derivadas
    (necessárias tanto para as 9 features do modelo quanto para os
    indicadoresNegocio exibidos no dashboard).
    """
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

    # CORRIGIDO: removido o "/12" — agora bate com o treino (reserva/despesa_total)
    meses_reserva = (sobra / despesa_total) if despesa_total > 0 else 0.0

    percentual_essenciais = (essenciais_total / despesa_total * 100) if despesa_total > 0 else 0.0
    percentual_recorrentes = (recorrentes_total / despesa_total * 100) if despesa_total > 0 else 0.0
    ticket_medio = (despesa_total / qtd_despesas) if qtd_despesas > 0 else 0.0

    meses_saldo_negativo = 0 if sobra >= 0 else 1

    #  PENDENTE DE DECISÃO: reserva_financeira ainda usa "sobra" como proxy.
    # Ver observação: no treino é um valor acumulado, não a sobra do mês atual.
    reserva_financeira = max(sobra, 0.0)

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
