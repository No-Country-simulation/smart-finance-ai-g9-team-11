import joblib
import numpy as np

from scripts.text_utils import limpar_texto

modelo = joblib.load("models/transaction_classifier.pkl")


def predizer_categoria(descricao: str, limite_confianca: float = 0.5) -> str:
    descricao = limpar_texto(descricao)

    probabilidades = modelo.predict_proba([descricao])[0]
    maior_probabilidade = np.max(probabilidades)

    if maior_probabilidade < limite_confianca:
        return "OUTROS"

    return modelo.classes_[np.argmax(probabilidades)]