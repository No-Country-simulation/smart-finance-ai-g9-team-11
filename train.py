"""
train.py
Treina, compara e versiona os dois algoritmos do fluxograma.
Execute: python train.py
"""

from ml.scripts.algorithm1.dataset_transacoes import gerar_dataset_transacoes_simulado
from ml.scripts.algorithm1.model_transacoes import treinar_e_comparar_modelos
from ml.scripts.algorithm2.dataset_perfil import gerar_dataset_perfil_simulado
from ml.scripts.algorithm2.model_perfil import treinar_e_comparar_perfil
from ml.scripts.model_registry import salvar_modelo_com_metadados


def main():
    print(">>> [1/4] Gerando dataset de transaÃ§Ãµes...")
    df_transacoes = gerar_dataset_transacoes_simulado(n_amostras=1500, seed=42)

    print(">>> [2/4] Treinando Algoritmo 1 (classificador de transaÃ§Ãµes)...")
    modelo1 = treinar_e_comparar_modelos(df_transacoes)
    salvar_modelo_com_metadados(
        modelo1, "ml/models/classificador_transacoes.joblib",
        "ml/metrics/classificador_transacoes.json",
        extra_metadados={"quantidade_registros_treino": len(df_transacoes)}
    )

    print("\n>>> [3/4] Gerando dataset de perfil financeiro...")
    df_perfil = gerar_dataset_perfil_simulado(n_amostras=1200, seed=42)

    print(">>> [4/4] Treinando Algoritmo 2 (classificador de perfil)...")
    modelo2 = treinar_e_comparar_perfil(df_perfil)
    salvar_modelo_com_metadados(
        modelo2, "ml/models/classificador_perfil.joblib",
        "ml/metrics/classificador_perfil.json",
        extra_metadados={"quantidade_registros_treino": len(df_perfil)}
    )

    print("\n=== TREINAMENTO CONCLUÃDO ===")


if __name__ == "__main__":
    main()




