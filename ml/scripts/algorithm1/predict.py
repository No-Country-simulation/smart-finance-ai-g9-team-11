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

def predizer_categoria(descricao: str, limite_confianca: float = 0.40) -> str:
    descricao = limpar_texto(descricao)

    if not descricao.strip():
        return "Outros"

    vectorizer = modelo.steps[0][1]
    vetor = vectorizer.transform([descricao])

    # Se a palavra não existe no vocabulário de treino, CAI EM "OUTROS"
    if vetor.nnz == 0:
        return "Outros"

    probabilidades = modelo.predict_proba([descricao])[0]
    maior_probabilidade = np.max(probabilidades)

    # Se o modelo não tiver certeza suficiente, CAI EM "OUTROS"
    if maior_probabilidade <= limite_confianca:
        return "Outros"

    return modelo.classes_[np.argmax(probabilidades)]