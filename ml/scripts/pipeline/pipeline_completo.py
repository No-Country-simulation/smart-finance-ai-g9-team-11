"""
pipeline_completo.py
Orquestra o fluxograma completo:

TransaÃ§Ãµes brutas
  -> ValidaÃ§Ã£o e limpeza
  -> Algoritmo 1 (classificaÃ§Ã£o de transaÃ§Ãµes)
  -> Tratamento de confianÃ§a
  -> Engenharia de indicadores financeiros
  -> Algoritmo 2 (classificaÃ§Ã£o de perfil)
  -> Score de saÃºde financeira
  -> Explicabilidade
  -> Motor de recomendaÃ§Ãµes
  -> Dashboard (JSON final)
"""

import uuid
from datetime import date

from ml.scripts.validation import validar_e_limpar_transacoes, validar_dados_financeiros
from ml.scripts.algorithm1.model_transacoes import classificar_transacoes
from ml.scripts.feature_engineering import calcular_indicadores_financeiros
from ml.scripts.algorithm2.model_perfil import prever_perfil
from ml.scripts.scoring import calcular_score_saude_financeira
from ml.scripts.explainability import gerar_explicabilidade
from ml.scripts.recommendations import gerar_recomendacoes_financeiras
from ml.scripts.dashboard import montar_dashboard


def executar_pipeline_completo(transacoes_brutas: list[dict], dados_financeiros: dict,
                                  modelo_transacoes: dict, modelo_perfil: dict,
                                  usuario_id: str = None) -> dict:

    usuario_id = usuario_id or f"user-{uuid.uuid4().hex[:8]}"

    # 1. ValidaÃ§Ã£o e limpeza
    dados_financeiros_validados = validar_dados_financeiros(dados_financeiros)
    df_transacoes_validas, transacoes_rejeitadas = validar_e_limpar_transacoes(transacoes_brutas)

    # 2. Algoritmo 1 + 3. Tratamento de confianÃ§a (jÃ¡ embutido em classificar_transacoes)
    df_classificado = classificar_transacoes(df_transacoes_validas, modelo_transacoes)

    transacoes_para_revisao = (
        df_classificado[df_classificado["necessita_revisao"] == True]
        [["descricao", "valor", "categoria_original_prevista", "probabilidade"]]
        .to_dict(orient="records")
    )

    # 4. Engenharia de indicadores financeiros
    indicadores = calcular_indicadores_financeiros(df_classificado, dados_financeiros_validados)

    # 5. Algoritmo 2 - perfil financeiro
    resultado_perfil = prever_perfil(modelo_perfil, indicadores)

    # 6. Score de saÃºde financeira + nÃ­vel de risco
    score_info = calcular_score_saude_financeira(indicadores, resultado_perfil)

    # 7. Explicabilidade
    _ = gerar_explicabilidade(
        indicadores, resultado_perfil, modelo_perfil.get("importancias_features")
    )

    # 8. Motor de recomendaÃ§Ãµes
    recomendacoes = gerar_recomendacoes_financeiras(
        resultado_perfil["perfil_financeiro"], indicadores, score_info
    )

    # 9. Dashboard (JSON final)
    dashboard = montar_dashboard(
        usuario_id=usuario_id,
        periodo_inicio=str(date.today().replace(day=1)),
        periodo_fim=str(date.today()),
        indicadores=indicadores,
        resultado_perfil=resultado_perfil,
        score_info=score_info,
        recomendacoes=recomendacoes,
        versoes_modelos={
            "classificador_transacoes": "v1.0.0",
            "classificador_perfil": "v1.0.0",
        },
        transacoes_para_revisao=transacoes_para_revisao,
    )

    dashboard["_debug"] = {
        "transacoes_rejeitadas_na_validacao": transacoes_rejeitadas,
    }

    return dashboard


