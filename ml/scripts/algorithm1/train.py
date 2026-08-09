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

# 1. Vocabulário Expandido com Termos Reais do Mercado Financeiro/Bancário BR
PALAVRAS_REAIS = {
    'Alimentação': [
        'ifood', 'restaurante', 'padaria', 'mcdonalds', 'outback', 'hortifruti', 
        'uber eats', 'ubereats', 'rappi delivery', 'burger king', 'supermercado', 
        'açougue', 'feira', 'cafeteria', 'starbucks', 'coco bambu', 'habibs'
    ],
    'Utilitários': [
        'conta luz enel', 'conta agua sabesp', 'internet claro', 'fatura vivo', 
        'gas comgas', 'tim celular', 'energia cpfl', 'sanepar agua', 'algar telecom'
    ],
    'Moradia': [
        'pagamento aluguel', 'quinto andar', 'imobiliaria', 'condominio mensal', 
        'taxa seguro incendio', 'lofts aluguel', 'iptu prefeitura'
    ],
    'Investimento': [
        'tesouro direto', 'aporte rico corretora', 'investimento xp', 'compra acao b3', 
        'cdb nubank', 'b3 SA', 'cripto binance', 'fii fundo imobiliario', 'inter investimentos'
    ],
    'Compras': [
        'amazon brasil', 'mercado livre', 'magalu', 'zara compras', 'shopee pagamento', 
        'aliexpress', 'mercado', 'carrefour', 'pao de acucar', 'kabum', 'shein brasil'
    ],
    'Outros': [
        'transferencia pix', 'tarifa bancaria', 'saque caixa eletronico', 'diversos', 
        'reembolso', 'iof imposto', 'anuidade cartao'
    ],
    'Entretenimento': [
        'netflix', 'spotify', 'cinema', 'steam', 'show', 'prime video', 
        'hbo max', 'playstation store', 'xbox live', 'ingressos com',
        'xbox', 'playstation', 'nintendo', 'game', 'jogos', 'pass' # <--- Adicionados aqui
    ],
    'Saúde': [
        'farmacia droga raia', 'consulta medica', 'exame laboratorio', 'drogalis', 
        'plano saude', 'drogasil', 'pague menos', 'fleury exames', 'smart fit'
    ],
    'Salário': [
        'deposito salario', 'pagamento empresa', 'holerite mensal', 
        'transferencia proventos', 'rendimento quinzenal', 'adiantamento salarial'
    ],
    'Trajeto': [
        'uber', 'corrida uber', '99app corrida', 'posto shell combustivel', 
        'estapar estacionamento', 'recarga bilhete unico', 'sem parar pedagio', 
        'veloe pedagios', 'ipva detran'
    ],
}

# 2. Stopwords em português para filtrar conectivos genéricos
STOP_WORDS_PT = [
    'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 
    'para', 'por', 'com', 'um', 'uma', 'uns', 'umas', 'e', 'a', 'o'
]


def limpar_texto(texto: str) -> str:
    """Aplica limpeza de texto via Regex, remoção de acentos e dígitos isolados."""
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    texto = unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')
    # Remove caracteres especiais e números isolados mantendo o texto limpo
    texto = re.sub(r'[^a-z\s]', ' ', texto)
    texto = re.sub(r'\s+', ' ', texto)
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
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    diretorio_ml = os.path.abspath(os.path.join(diretorio_atual, "..", ".."))

    caminho_csv = os.path.join(diretorio_ml, "data", "raw", "Financial_Transactions_By_User.csv")
    pasta_modelos = os.path.join(diretorio_ml, "models")
    caminho_modelo_saida = os.path.join(pasta_modelos, "transaction_classifier.pkl")

    df = carregar_e_tratar_dados(caminho_csv)

    X = df['Transaction Description']
    y = df['Category']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Treinando modelo otimizado (TF-IDF + Random Forest Tuning)...")
    pipeline = Pipeline([
        ('vetorizador', TfidfVectorizer(
            analyzer='word',
            ngram_range=(1, 3),        # Captura unigramas, bigramas e trigramas (ex: 'fatura', 'vivo', 'fatura vivo')
            sublinear_tf=True,         # Suaviza termos com alta frequência (1 + log(tf))
            stop_words=STOP_WORDS_PT,  # Remove conectivos sem valor semântico
            min_df=1,                  # Mantém termos raros relevantes
            norm='l2'                  # Normaliza vetores pelo comprimento L2
        )),
        ('classificador', RandomForestClassifier(
        n_estimators=200,
        max_depth=None,           # Permite que palavras exatas tenham 100% de probabilidade
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    ))
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    print("\n--- RELATÓRIO DE CLASSIFICAÇÃO ---")
    print(classification_report(y_test, y_pred))

    os.makedirs(pasta_modelos, exist_ok=True)
    joblib.dump(pipeline, caminho_modelo_saida)
    print(f"Modelo salvo com sucesso em: {caminho_modelo_saida}")


if __name__ == "__main__":
    treinar_modelo()