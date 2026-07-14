"""
validation.py
Bloco de PRÃ‰-PROCESSAMENTO do fluxograma:
- validaÃ§Ã£o
- remoÃ§Ã£o de duplicidades
- normalizaÃ§Ã£o de valores
- tratamento de datas ausentes
TransaÃ§Ãµes invÃ¡lidas sÃ£o separadas e reportadas, nunca enviadas ao modelo.
"""

import pandas as pd


class ErroValidacaoTransacoes(Exception):
    pass


def validar_e_limpar_transacoes(transacoes: list[dict]) -> tuple[pd.DataFrame, list[dict]]:
    """
    Recebe uma lista de dicts (descricao, valor[, data]) e retorna:
    - DataFrame de transaÃ§Ãµes vÃ¡lidas e limpas
    - lista de transaÃ§Ãµes rejeitadas com o motivo
    """
    if not transacoes:
        raise ErroValidacaoTransacoes("A lista de transaÃ§Ãµes nÃ£o pode estar vazia.")

    df = pd.DataFrame(transacoes)

    if "descricao" not in df.columns or "valor" not in df.columns:
        raise ErroValidacaoTransacoes("Cada transaÃ§Ã£o deve conter 'descricao' e 'valor'.")

    rejeitadas = []
    validas_idx = []

    for idx, linha in df.iterrows():
        descricao = linha.get("descricao")
        valor = linha.get("valor")
        motivo = None

        if not isinstance(descricao, str) or not descricao.strip():
            motivo = "descricao vazia ou invÃ¡lida"
        elif valor is None or not _e_numero(valor):
            motivo = "valor ausente ou nÃ£o numÃ©rico"
        elif float(valor) <= 0:
            motivo = "valor deve ser maior que zero"

        if motivo:
            rejeitadas.append({**linha.to_dict(), "motivo_rejeicao": motivo})
        else:
            validas_idx.append(idx)

    df_validas = df.loc[validas_idx].copy()

    if df_validas.empty:
        raise ErroValidacaoTransacoes("Nenhuma transaÃ§Ã£o vÃ¡lida apÃ³s a validaÃ§Ã£o.")

    # normalizaÃ§Ã£o de valores
    df_validas["valor"] = df_validas["valor"].astype(float).round(2)
    df_validas["descricao"] = df_validas["descricao"].astype(str).str.strip()

    # remoÃ§Ã£o de duplicidades exatas (mesma descricao + valor)
    antes = len(df_validas)
    df_validas = df_validas.drop_duplicates(subset=["descricao", "valor"]).reset_index(drop=True)
    duplicadas_removidas = antes - len(df_validas)

    if duplicadas_removidas > 0:
        rejeitadas.append({
            "descricao": None,
            "valor": None,
            "motivo_rejeicao": f"{duplicadas_removidas} transaÃ§Ã£o(Ãµes) duplicada(s) removida(s)"
        })

    # tratamento de datas (se existir a coluna, preenche ausentes)
    if "data" in df_validas.columns:
        df_validas["data"] = pd.to_datetime(df_validas["data"], errors="coerce")

    return df_validas, rejeitadas


def _e_numero(valor) -> bool:
    try:
        float(valor)
        return True
    except (TypeError, ValueError):
        return False


def validar_dados_financeiros(dados: dict) -> dict:
    """
    Valida os dados financeiros gerais do usuÃ¡rio (renda, endividamento etc.).
    """
    campos_obrigatorios = ["renda_mensal", "nivel_endividamento"]
    faltantes = [c for c in campos_obrigatorios if c not in dados]
    if faltantes:
        raise ErroValidacaoTransacoes(f"Campos obrigatÃ³rios faltando: {faltantes}")

    if dados["renda_mensal"] is None or float(dados["renda_mensal"]) <= 0:
        raise ErroValidacaoTransacoes("renda_mensal deve ser maior que zero")

    if not (0 <= float(dados["nivel_endividamento"]) <= 100):
        raise ErroValidacaoTransacoes("nivel_endividamento deve estar entre 0 e 100")

    dados = dados.copy()
    dados.setdefault("poupanca_mensal", 0.0)
    dados.setdefault("reserva_financeira", 0.0)
    dados.setdefault("meses_saldo_negativo", 0)
    dados.setdefault("frequencia_poupanca", "Baixa")

    return dados


