"""
predict.py
Executa o pipeline completo com um exemplo real (CLI), Ãºtil para
demonstrar o fluxo para a equipe.
"""

import json

from ml.scripts.model_registry import carregar_modelo_com_metadados
from ml.scripts.pipeline.pipeline_completo import executar_pipeline_completo


def main():
    modelo1, _ = carregar_modelo_com_metadados(
        "ml/models/classificador_transacoes.joblib", "ml/metrics/classificador_transacoes.json"
    )
    modelo2, _ = carregar_modelo_com_metadados(
        "ml/models/classificador_perfil.joblib", "ml/metrics/classificador_perfil.json"
    )

    transacoes_brutas = [
        {"descricao": "Supermercado Mateus", "valor": 420.0},
        {"descricao": "Uber", "valor": 60.0},
        {"descricao": "Farmacia", "valor": 150.0},
        {"descricao": "Netflix", "valor": 40.0},
        {"descricao": "Conta de energia", "valor": 280.0},
        {"descricao": "Aluguel Apartamento", "valor": 1500.0},
        {"descricao": "Posto Shell", "valor": 200.0},
        {"descricao": "Restaurante Sabor Caseiro", "valor": 90.0},
    ]

    dados_financeiros = {
        "renda_mensal": 4500,
        "nivel_endividamento": 25,
        "poupanca_mensal": 300,
        "reserva_financeira": 1500,
        "meses_saldo_negativo": 0,
        "frequencia_poupanca": "Media",
    }

    resultado = executar_pipeline_completo(
        transacoes_brutas, dados_financeiros, modelo1, modelo2, usuario_id="user-001"
    )

    print(json.dumps(resultado, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()




