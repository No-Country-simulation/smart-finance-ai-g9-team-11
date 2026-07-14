"""
model_registry.py
Salva modelos treinados com metadados completos (versÃ£o, mÃ©tricas, ambiente).
"""

import json
import platform
from datetime import datetime
from pathlib import Path

import joblib
import sklearn

VERSAO_PROJETO = "1.0.0"


def salvar_modelo_com_metadados(modelo_info, caminho_modelo, caminho_metricas, extra_metadados=None):
    caminho_modelo, caminho_metricas = Path(caminho_modelo), Path(caminho_metricas)
    caminho_modelo.parent.mkdir(parents=True, exist_ok=True)
    caminho_metricas.parent.mkdir(parents=True, exist_ok=True)

    objeto_para_salvar = {
        k: v for k, v in modelo_info.items()
        if k in ("modelo", "pipeline", "colunas_features", "classes", "nome_modelo", "importancias_features")
    }
    joblib.dump(objeto_para_salvar, caminho_modelo)

    metadados = {
        "versao_projeto": VERSAO_PROJETO,
        "data_treinamento": datetime.now().isoformat(timespec="seconds"),
        "nome_modelo_escolhido": modelo_info.get("nome_modelo"),
        "classes": modelo_info.get("classes"),
        "metricas_todos_modelos": modelo_info.get("metricas_todos_modelos"),
        "ambiente": {
            "python_version": platform.python_version(),
            "sklearn_version": sklearn.__version__,
        },
    }
    if extra_metadados:
        metadados.update(extra_metadados)

    with open(caminho_metricas, "w", encoding="utf-8") as f:
        json.dump(metadados, f, indent=2, ensure_ascii=False)

    print(f"[OK] Modelo salvo em: {caminho_modelo}")
    print(f"[OK] Metadados salvos em: {caminho_metricas}")
    return metadados


def carregar_modelo_com_metadados(caminho_modelo, caminho_metricas):
    modelo_info = joblib.load(caminho_modelo)
    with open(caminho_metricas, "r", encoding="utf-8") as f:
        metadados = json.load(f)
    return modelo_info, metadados


