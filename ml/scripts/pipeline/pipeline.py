from scripts.algorithm1.predict import classificar_transacoes
from scripts.feature_engineering import extrair_features
from scripts.algorithm2.predict import classificar_perfil


def executar_pipeline(df):

    df = classificar_transacoes(df)

    features = extrair_features(df)

    perfil = modelo_risco.predict(features)

    return resposta