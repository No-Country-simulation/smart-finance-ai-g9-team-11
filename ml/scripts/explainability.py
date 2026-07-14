"""
explainability.py
Gera as razÃµes pelas quais o usuÃ¡rio recebeu determinado perfil financeiro,
combinando regras de negÃ³cio com a importÃ¢ncia das features do modelo.
"""


def gerar_explicabilidade(indicadores: dict, resultado_perfil: dict,
                            importancias_features: dict = None) -> dict:
    fatores = []

    comprometimento = indicadores.get("comprometimento_renda", 0)
    taxa_poupanca = indicadores.get("taxa_poupanca", 0)
    meses_reserva = indicadores.get("meses_reserva", 0)
    endividamento = indicadores.get("nivel_endividamento", 0)
    margem_sobra = indicadores.get("margem_sobra", 0)

    if margem_sobra < 0:
        fatores.append("As despesas totais superam a renda mensal lÃ­quida.")
    if comprometimento > 70:
        fatores.append(f"O comprometimento da renda estÃ¡ em {comprometimento:.1f}%, considerado elevado.")
    if endividamento >= 40:
        fatores.append(f"O nÃ­vel de endividamento ({endividamento:.1f}%) estÃ¡ acima do recomendado.")
    if taxa_poupanca < 10:
        fatores.append(f"A taxa de poupanÃ§a mensal ({taxa_poupanca:.1f}%) estÃ¡ abaixo do ideal (>=15%).")
    if meses_reserva < 3:
        fatores.append(f"A reserva financeira cobre apenas {meses_reserva:.1f} mÃªs(es) de despesas.")

    if not fatores:
        fatores.append("Os indicadores financeiros estÃ£o dentro dos parÃ¢metros considerados saudÃ¡veis.")

    resultado = {
        "fatores_determinantes": fatores,
        "perfil_atribuido": resultado_perfil["perfil_financeiro"],
        "probabilidade_classificacao": resultado_perfil["probabilidade"],
    }

    if importancias_features:
        top_features = sorted(importancias_features.items(), key=lambda x: x[1], reverse=True)[:5]
        resultado["variaveis_mais_relevantes"] = [
            {"variavel": nome, "importancia": valor} for nome, valor in top_features
        ]

    return resultado


