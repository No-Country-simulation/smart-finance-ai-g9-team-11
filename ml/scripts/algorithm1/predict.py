import joblib
import pandas as pd

# Carrega o modelo apenas uma vez
modelo = joblib.load("models/transaction_classifier.pkl")

def classificar_transacoes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Classifica todas as transações utilizando o modelo NLP.
    """

    df = df.copy()

    df["Category"] = modelo.predict(
        df["Transaction Description"]
    )

    return df