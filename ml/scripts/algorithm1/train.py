import os
import re
import unicodedata
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

# Dicionários de Tradução e Enriquecimento de Dados
CATEGORIAS_BR = {
    "Food & Drink": "Alimentação",
    "Utilities": "Utilitários",
    "Rent": "Moradia",
    "Investment": "Investimento",
    "Shopping": "Compras",
    "Health & Fitness": "Saúde",
    "Entertainment": "Entretenimento",
    "Travel": "Trajeto",
    "Salary": "Salário",
    "Other": "Outros"
}

TIPO_TRANSACAO_BR = {
    'Income': 'Receita',
    'Expense': 'Despesa'
}

PALAVRAS_REAIS = {
    'Alimentação': ['ifood', 'restaurante', 'padaria', 'mcdonalds', 'outback', 'hortifruti', 'uber eats', 'rappi delivery'],
    'Utilitários': ['conta luz enel', 'conta agua sabesp', 'internet claro', 'fatura vivo', 'gas comgas'],
    'Moradia': ['pagamento aluguel', 'quinto andar', 'imobiliaria', 'condominio mensal', 'taxa seguro incendio'],
    'Investimento': ['tesouro direto', 'aporte rico corretora', 'investimento xp', 'compra acao b3', 'cdb nubank'],
    'Compras': ['amazon brasil', 'mercado livre', 'magalu', 'zara compras', 'shopee pagamento', 'aliexpress'],
    'Outros': ['transferencia pix', 'tarifa bancaria', 'saque caixa eletronico', 'diversos', 'reembolso'],
    'Entretenimento': ['netflix', 'spotify', 'cinema', 'steam', 'show'],
    'Saúde': ['farmacia droga raia', 'consulta medica', 'exame laboratorio', 'drogalis', 'plano saude'],
    'Salário': ['deposito salario', 'pagamento empresa', 'holerite mensal', 'transferencia proventos'],
    'Trajeto': ['uber', '99app corrida', 'posto shell combustivel', 'estapar estacionamento', 'recarga bilhete unico']
}


def limpar_texto(texto: str) -> str:
    """Aplica limpeza de texto via Regex e remoção de acentos."""
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    texto = unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')
    texto = re.sub(r'[^\w\s]', '', texto)
    return texto.strip()


def injetar_padrao_real(row: pd.Series) -> str:
    """Substitui descrições sintéticas por palavras reais baseadas na categoria."""
    cat = row['Category']
    if cat in PALAVRAS_REAIS:
        return np.random.choice(PALAVRAS_REAIS[cat])
    return row['Transaction Description']


def carregar_e_tratar_dados(caminho_csv: str) -> pd.DataFrame:
    """Carrega o dataset e realiza mapeamento e limpeza."""
    print(f"Lendo dataset em: {caminho_csv}")
    df = pd.read_csv(caminho_csv)

    # Mapeamento e tradução
    df['Category'] = df['Category'].map(CATEGORIAS_BR)
    df['Type'] = df['Type'].map(TIPO_TRANSACAO_BR)

    # Injeção de termos e Limpeza de Texto
    np.random.seed(42)
    df['Transaction Description'] = df.apply(injetar_padrao_real, axis=1)
    df['Transaction Description'] = df['Transaction Description'].apply(limpar_texto)

    return df


def treinar_modelo():
    # 1. Definir caminhos apontando explicitamente para a pasta 'ml'
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    
    # Navega até o diretório 'ml'
    diretorio_ml = os.path.abspath(os.path.join(diretorio_atual, "..", ".."))

    # Ajusta o caminho do CSV para ficar dentro de ml/data/raw/
    caminho_csv = os.path.join(diretorio_ml, "data", "raw", "Financial_Transactions_By_User.csv")
    pasta_modelos = os.path.join(diretorio_ml, "models")
    caminho_modelo_saida = os.path.join(pasta_modelos, "transaction_classifier.pkl")

    # 2. Processar Dados
    df = carregar_e_tratar_dados(caminho_csv)

    X = df['Transaction Description']
    y = df['Category']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Construir Pipeline
    print("Treinando modelo (TF-IDF + Random Forest)...")
    pipeline = Pipeline([
        ('vetorizador', TfidfVectorizer(
            analyzer='word',
            ngram_range=(1, 2),
            sublinear_tf=True
        )),
        ('classificador', RandomForestClassifier(
            class_weight='balanced',
            random_state=42
        ))
    ])

    pipeline.fit(X_train, y_train)

    # 4. Avaliar Modelo
    y_pred = pipeline.predict(X_test)
    print("\n--- RELATÓRIO DE CLASSIFICAÇÃO ---")
    print(classification_report(y_test, y_pred))

    # 5. Salvar Artefato (.pkl)
    os.makedirs(pasta_modelos, exist_ok=True)
    joblib.dump(pipeline, caminho_modelo_saida)
    print(f"Modelo salvo com sucesso em: {caminho_modelo_saida}")


if __name__ == "__main__":
    treinar_modelo()