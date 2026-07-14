"""
model_transacoes.py
ALGORITMO 1 - ClassificaÃ§Ã£o automÃ¡tica de transaÃ§Ãµes.
Treina, compara e escolhe o melhor modelo entre 4 candidatos.
"""

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, recall_score
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

from ml.scripts.text_utils import limpar_texto
from ml.scripts.confidence import aplicar_regra_confianca

SEED = 42


def _preparar_dados(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["descricao_limpa"] = df["descricao"].apply(limpar_texto)
    return df


def _construir_pipeline(modelo_final):
    preprocessador = ColumnTransformer(
        transformers=[
            ("texto", TfidfVectorizer(max_features=300, ngram_range=(1, 2)), "descricao_limpa"),
            ("numerico", StandardScaler(), ["valor"]),
        ],
        remainder="drop",
    )
    return Pipeline(steps=[("preprocessador", preprocessador), ("classificador", modelo_final)])


def treinar_e_comparar_modelos(df: pd.DataFrame) -> dict:
    df = _preparar_dados(df)
    X = df[["descricao_limpa", "valor"]]
    y = df["categoria"]

    X_treino, X_teste, y_treino, y_teste = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    candidatos = {
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=SEED),
        "random_forest": RandomForestClassifier(n_estimators=200, random_state=SEED),
        "svm": SVC(probability=True, random_state=SEED),
        "naive_bayes": MultinomialNB(),
    }

    metricas_todos_modelos, pipelines_treinados = {}, {}

    for nome, modelo in candidatos.items():
        if nome == "naive_bayes":
            preprocessador = ColumnTransformer(
                transformers=[("texto", TfidfVectorizer(max_features=300, ngram_range=(1, 2)), "descricao_limpa")],
                remainder="drop",
            )
            pipeline = Pipeline(steps=[("preprocessador", preprocessador), ("classificador", modelo)])
        else:
            pipeline = _construir_pipeline(modelo)

        pipeline.fit(X_treino, y_treino)
        y_pred = pipeline.predict(X_teste)

        f1_macro = f1_score(y_teste, y_pred, average="macro", zero_division=0)
        recall_macro = recall_score(y_teste, y_pred, average="macro", zero_division=0)

        try:
            cv_media = float(np.mean(cross_val_score(pipeline, X, y, cv=5, scoring="f1_macro")))
        except Exception:
            cv_media = None

        metricas_todos_modelos[nome] = {
            "f1_macro": float(f1_macro),
            "recall_macro": float(recall_macro),
            "cv_f1_macro_media": cv_media,
        }
        pipelines_treinados[nome] = pipeline

    melhor_nome = max(metricas_todos_modelos, key=lambda k: metricas_todos_modelos[k]["f1_macro"])
    melhor_pipeline = pipelines_treinados[melhor_nome]

    return {
        "modelo": melhor_pipeline,
        "nome_modelo": melhor_nome,
        "classes": list(melhor_pipeline.classes_),
        "metricas_todos_modelos": metricas_todos_modelos,
    }


def classificar_transacoes(df_transacoes: pd.DataFrame, modelo_info: dict) -> pd.DataFrame:
    """
    Classifica transaÃ§Ãµes e aplica a regra de confianÃ§a do fluxograma
    (>=70% aceita | 50-69% baixa confianÃ§a | <50% -> 'outras' + revisÃ£o).
    """
    df = _preparar_dados(df_transacoes)
    pipeline = modelo_info["modelo"]

    X = df[["descricao_limpa", "valor"]]
    probabilidades = pipeline.predict_proba(X)
    classes = pipeline.classes_

    resultados = []
    for linha_probs in probabilidades:
        idx_top1 = int(np.argmax(linha_probs))
        categoria_prevista = classes[idx_top1]
        confianca = float(linha_probs[idx_top1])

        regra = aplicar_regra_confianca(categoria_prevista, confianca)

        resultados.append({
            "categoria": regra["categoria"],
            "categoria_original_prevista": categoria_prevista,
            "probabilidade": round(confianca, 4),
            "nivel_confianca": regra["nivel_confianca"],
            "necessita_revisao": regra["necessita_revisao"],
        })

    df_resultado = df_transacoes.reset_index(drop=True).copy()
    df_resultado = pd.concat([df_resultado, pd.DataFrame(resultados)], axis=1)
    return df_resultado


