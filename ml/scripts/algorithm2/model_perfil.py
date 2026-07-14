"""
model_perfil.py
ALGORITMO 2 - ClassificaÃ§Ã£o do perfil financeiro.
Recebe indicadores agregados (NÃƒO transaÃ§Ãµes brutas), treina e compara modelos,
priorizando recall da classe "em_risco".
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, recall_score
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

SEED = 42

COLUNAS_FEATURES = [
    "renda_mensal_liquida", "despesa_total", "nivel_endividamento",
    "poupanca_mensal", "reserva_financeira", "meses_saldo_negativo",
    "percentual_essenciais", "ticket_medio", "percentual_recorrentes",
    "margem_sobra", "comprometimento_renda", "taxa_poupanca", "meses_reserva",
]


def treinar_e_comparar_perfil(df: pd.DataFrame) -> dict:
    colunas_features = [c for c in COLUNAS_FEATURES if c in df.columns]
    X = df[colunas_features]
    y = df["perfil"]

    X_treino, X_teste, y_treino, y_teste = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    candidatos = {
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=SEED),
        "random_forest": RandomForestClassifier(n_estimators=200, random_state=SEED),
        "svm": SVC(probability=True, random_state=SEED),
    }

    metricas_todos_modelos, pipelines_treinados = {}, {}

    for nome, modelo in candidatos.items():
        pipeline = Pipeline(steps=[("scaler", StandardScaler()), ("classificador", modelo)])
        pipeline.fit(X_treino, y_treino)
        y_pred = pipeline.predict(X_teste)

        f1_macro = f1_score(y_teste, y_pred, average="macro", zero_division=0)
        recall_em_risco = (
            recall_score(y_teste, y_pred, labels=["em_risco"], average="macro", zero_division=0)
            if "em_risco" in y_teste.unique() else None
        )

        try:
            cv_media = float(np.mean(cross_val_score(pipeline, X, y, cv=5, scoring="f1_macro")))
        except Exception:
            cv_media = None

        metricas_todos_modelos[nome] = {
            "f1_macro": float(f1_macro),
            "recall_em_risco": float(recall_em_risco) if recall_em_risco is not None else None,
            "cv_f1_macro_media": cv_media,
        }
        pipelines_treinados[nome] = pipeline

    def score_ordenacao(nome):
        m = metricas_todos_modelos[nome]
        return (m["recall_em_risco"] or 0, m["f1_macro"])

    melhor_nome = max(metricas_todos_modelos, key=score_ordenacao)
    melhor_pipeline = pipelines_treinados[melhor_nome]

    # feature importance (quando disponÃ­vel) para a Explicabilidade
    importancias = None
    classificador = melhor_pipeline.named_steps["classificador"]
    if hasattr(classificador, "feature_importances_"):
        importancias = dict(zip(colunas_features, classificador.feature_importances_.round(4).tolist()))

    return {
        "pipeline": melhor_pipeline,
        "nome_modelo": melhor_nome,
        "classes": list(melhor_pipeline.classes_),
        "colunas_features": colunas_features,
        "metricas_todos_modelos": metricas_todos_modelos,
        "importancias_features": importancias,
    }


def prever_perfil(modelo_info: dict, indicadores: dict) -> dict:
    """
    Recebe o dict de indicadores (saÃ­da da engenharia de atributos)
    e retorna perfil + probabilidade + probabilidades por classe.
    """
    colunas_features = modelo_info["colunas_features"]
    pipeline = modelo_info["pipeline"]

    linha = {c: indicadores.get(c, 0) for c in colunas_features}
    X = pd.DataFrame([linha])

    probabilidades = pipeline.predict_proba(X)[0]
    classes = pipeline.classes_

    idx_top = int(np.argmax(probabilidades))
    perfil_previsto = classes[idx_top]
    probabilidade = float(probabilidades[idx_top])

    dict_probabilidades = {classes[i]: round(float(probabilidades[i]), 4) for i in range(len(classes))}

    return {
        "perfil_financeiro": perfil_previsto,
        "probabilidade": round(probabilidade, 4),
        "probabilidades": dict_probabilidades,
    }


