"""
dashboard.py
Monta a estrutura final do JSON do dashboard, unificando todos os blocos
do fluxograma: visÃ£o geral, comportamento, saÃºde e risco, recomendaÃ§Ãµes.
"""

from datetime import datetime, date


def montar_dashboard(usuario_id: str, periodo_inicio: str, periodo_fim: str,
                       indicadores: dict, resultado_perfil: dict, score_info: dict,
                       recomendacoes: dict, versoes_modelos: dict,
                       transacoes_para_revisao: list = None) -> dict:

    return {
        "usuario_id": usuario_id,
        "periodo": {
            "inicio": periodo_inicio,
            "fim": periodo_fim,
        },
        "visao_geral": {
            "renda_mensal_liquida": indicadores["renda_mensal_liquida"],
            "despesa_total": indicadores["despesa_total"],
            "margem_sobra": indicadores["margem_sobra"],
            "percentual_sobra": indicadores["percentual_sobra"],
        },
        "comportamento": {
            "distribuicao_categorias": indicadores["gasto_por_categoria"],
            "ranking_gastos": indicadores["ranking_gastos"],
            "ticket_medio": indicadores["ticket_medio"],
            "categoria_dominante": indicadores["categoria_dominante"],
            "gastos_recorrentes": indicadores["gastos_recorrentes"],
        },
        "saude_risco": {
            "perfil_financeiro": resultado_perfil["perfil_financeiro"],
            "score_saude_financeira": score_info["score_saude_financeira"],
            "probabilidade": resultado_perfil["probabilidade"],
            "probabilidades": resultado_perfil["probabilidades"],
            "nivel_risco": score_info["nivel_risco"],
            "nivel_endividamento": indicadores["nivel_endividamento"],
            "comprometimento_renda": indicadores["comprometimento_renda"],
            "taxa_poupanca": indicadores["taxa_poupanca"],
            "meses_reserva": indicadores["meses_reserva"],
        },
        "recomendacoes_financeiras": recomendacoes,
        "transacoes_para_revisao": transacoes_para_revisao or [],
        "modelos": versoes_modelos,
        "gerado_em": datetime.now().isoformat(timespec="seconds"),
    }


