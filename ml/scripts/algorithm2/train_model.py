import joblib
import pandas as pd
from pathlib import Path

from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.inspection import permutation_importance

from ml.scripts.algorithm2.dataset_profile import (
    gerar_dataset_perfil_simulado,
    FEATURES_MODELO_PERFIL,
    TARGET_COLUNA,
)

# Sobe 3 níveis a partir deste arquivo (algorithm2 -> scripts -> ml) para salvar diretamente em ml/models
MODELS_DIR = Path(__file__).resolve().parents[2] / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODELS_DIR / "gb_profile.pkl"
SCALER_PATH = MODELS_DIR / "scaler_profile.pkl"
ENCODER_PATH = MODELS_DIR / "label_encoder_profile.pkl"
FEATURES_PATH = MODELS_DIR / "features_profile.pkl"

BEST_PARAMS = {
    "max_iter": 100,
    "max_depth": 10,
    "learning_rate": 0.01,
    "l2_regularization": 0.1,
}


def main():
    print("🔄 Gerando dataset simulado...")
    df = gerar_dataset_perfil_simulado(n_amostras=1200, seed=42)

    print(f"📊 Dataset gerado: {df.shape[0]} amostras")
    print(df[TARGET_COLUNA].value_counts())

    X = df[FEATURES_MODELO_PERFIL]
    y = df[TARGET_COLUNA]

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("🚀 Treinando HistGradientBoostingClassifier (params tunados)...")
    model = HistGradientBoostingClassifier(
        random_state=42,
        early_stopping=True,
        **BEST_PARAMS,
    )
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)

    print("\n✅ Acurácia:", accuracy_score(y_test, y_pred))
    print("\n📈 Relatório de Classificação:")
    print(classification_report(y_test, y_pred, target_names=encoder.classes_))
    print("📉 Matriz de Confusão:")
    print(confusion_matrix(y_test, y_pred))
    print("\n🎯 F1-macro (teste):", f1_score(y_test, y_pred, average="macro"))

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring="f1_macro")
    print(f"\n🔁 F1-macro médio (CV): {scores.mean():.4f} ± {scores.std():.4f}")

    result = permutation_importance(
        model, X_test_scaled, y_test,
        n_repeats=10, random_state=42, scoring="f1_macro", n_jobs=-1
    )
    importancias = pd.Series(result.importances_mean, index=FEATURES_MODELO_PERFIL)
    print("\n🔍 Importância das Features (permutation):")
    print(importancias.sort_values(ascending=False))

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(encoder, ENCODER_PATH)
    joblib.dump(FEATURES_MODELO_PERFIL, FEATURES_PATH)

    print(f"\n💾 Modelo salvo em: {MODEL_PATH}")
    print(f"💾 Scaler salvo em: {SCALER_PATH}")
    print(f"💾 Encoder salvo em: {ENCODER_PATH}")
    print(f"💾 Features salvas em: {FEATURES_PATH}")


if __name__ == "__main__":
    main()