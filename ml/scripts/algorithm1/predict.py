from pathlib import Path

import joblib
import numpy as np

from ml.scripts.text_utils import limpar_texto

MODELS_DIR = Path(__file__).resolve().parents[2] / "models"

modelo = joblib.load(
    MODELS_DIR / "transaction_classifier.pkl"
)

from pathlib import Path

import joblib
import numpy as np

from ml.scripts.text_utils import limpar_texto

MODELS_DIR = Path(__file__).resolve().parents[2] / "models"

modelo = joblib.load(
    MODELS_DIR / "transaction_classifier.pkl"
)

def predizer_categoria(descricao: str, limite_confianca: float = 0.65) -> str:
    descricao = limpar_texto(descricao)

    # 1. Se o texto ficou vazio após a limpeza
    if not descricao.strip():
        return "Outros"

    # 2. Pega o vetorizador do primeiro passo do Pipeline (sem depender do nome da chave)
    vectorizer = modelo.steps[0][1]
    vetor = vectorizer.transform([descricao])

    # Se a quantidade de elementos não-zeros (nnz) for 0, nenhuma palavra é conhecida pelo vocabulário
    if vetor.nnz == 0:
        return "Outros"

    # 3. Predição normal com o modelo
    probabilidades = modelo.predict_proba([descricao])[0]
    maior_probabilidade = np.max(probabilidades)

    if maior_probabilidade <= limite_confianca:
        return "Outros"

    return modelo.classes_[np.argmax(probabilidades)]