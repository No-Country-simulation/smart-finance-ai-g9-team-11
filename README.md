# FinanceAI — Módulo de Machine Learning

Este módulo é responsável pela inteligência do FinanceAI: classificação
automática de transações e classificação do perfil financeiro do usuário,
seguindo o fluxograma técnico definido no documento **"Algoritmos para
FinanceAI"**.

---

## Sumário

1. [Visão geral do fluxo](#1-visão-geral-do-fluxo)
2. [Algoritmo 1 — Classificação das transações](#2-algoritmo-1--classificação-das-transações)
3. [Camada intermediária — Engenharia de indicadores financeiros](#3-camada-intermediária--engenharia-de-indicadores-financeiros)
4. [Algoritmo 2 — Classificação do perfil financeiro](#4-algoritmo-2--classificação-do-perfil-financeiro)
5. [Blocos adicionais (melhorias propostas no documento)](#5-blocos-adicionais-melhorias-propostas-no-documento)
6. [Estrutura de pastas](#6-estrutura-de-pastas)
7. [JSON final do Dashboard](#7-json-final-do-dashboard)
8. [Como executar](#8-como-executar)
9. [Integração com o backend](#9-integração-com-o-backend)
10. [Próximos passos](#10-próximos-passos)

---

## 1. Visão geral do fluxo

```
Transações brutas
      │
      ▼
Validação e limpeza dos dados
      │
      ▼
ALGORITMO 1 — Classificador de transações
      │
      ▼
Tratamento de confiança (>=70% aceita | 50-69% baixa confiança | <50% "outras" + revisão)
      │
      ▼
Engenharia de indicadores financeiros
      │
      ▼
ALGORITMO 2 — Classificador de perfil financeiro
      │
      ▼
Score de saúde financeira + Nível de risco
      │
      ▼
Explicabilidade
      │
      ▼
Motor de recomendações
      │
      ▼
Dashboard (JSON final)
```

Esse serviço é exposto via **FastAPI** e consumido pelo backend
**Spring Boot** (pacote `br.com.financeai`), que nunca acessa os
arquivos `.pkl`/`.joblib` diretamente — toda a inferência passa pela API.

---

## 2. Algoritmo 1 — Classificação das transações

**Entrada:** descrição da transação + valor.

**Saída:**

```json
{
  "descricao": "Supermercado Mateus",
  "valor": 420.0,
  "categoria": "alimentacao",
  "probabilidade": 0.94
}
```

**Categorias:** alimentação, transporte, saúde, moradia, educação, lazer, serviços, outras.

**Pipeline técnico:**

- Limpeza de texto (remoção de acentos, números, datas, ruído)
- Vetorização TF-IDF (1-2 gramas) + valor normalizado (StandardScaler)
- 4 modelos treinados e comparados: Logistic Regression, Random Forest, SVM, Naive Bayes — o melhor por `f1_macro` é selecionado automaticamente
- Regra de confiança aplicada sobre a probabilidade da classe prevista

---

## 3. Camada intermediária — Engenharia de indicadores financeiros

Ponto crítico do projeto (destacado no documento): o Algoritmo 2 **nunca**
recebe transações brutas ou apenas categorias — ele recebe indicadores
agregados, calculados a partir das transações já classificadas:

- despesa total e gasto por categoria
- ticket médio e categoria dominante
- gastos recorrentes
- margem de sobra e percentual de sobra
- comprometimento da renda
- taxa de poupança e meses de reserva
- nível de endividamento

---

## 4. Algoritmo 2 — Classificação do perfil financeiro

**Entrada:** indicadores agregados (não transações).

**Saída:**

```json
{
  "perfil_financeiro": "em_observacao",
  "probabilidade": 0.82,
  "nivel_endividamento": 0.25,
  "score_saude_financeira": 64
}
```

**Perfis:** saudável, em observação, em risco.

**Pipeline técnico:**

- Features numéricas padronizadas (StandardScaler)
- 3 modelos comparados: Logistic Regression, Random Forest, SVM
- Seleção do melhor modelo priorizando **recall da classe "em_risco"** (evita falsos negativos em usuários com risco financeiro real)
- Score de saúde financeira (0-100) calculado por combinação ponderada de: comprometimento da renda (35%), taxa de poupança (25%), meses de reserva (20%) e endividamento (20%)

---

## 5. Blocos adicionais (melhorias propostas no documento)

| Bloco | Posição no fluxo | Arquivo |
|---|---|---|
| Validação e limpeza dos dados | Antes do Algoritmo 1 | `scripts/validation.py` |
| Confiança da classificação | Depois do Algoritmo 1 | `scripts/confidence.py` |
| Engenharia de indicadores financeiros | Antes do Algoritmo 2 | `scripts/feature_engineering.py` |
| Explicabilidade | Depois do Algoritmo 2 | `scripts/explainability.py` |
| Histórico e evolução | Depois do Dashboard | *(futuro — persistência por período)* |

---

## 6. Estrutura de pastas

```
ml/
├── data/                     # dados brutos e processados
│   ├── raw/
│   └── processed/
├── notebooks/                # EDA, limpeza, treino exploratório
│   └── eda_and_training.ipynb
├── models/                   # modelos treinados (.joblib)
│   ├── classificador_transacoes.joblib
│   └── classificador_perfil.joblib
├── metrics/                  # métricas e metadados de cada modelo
│   ├── classificador_transacoes.json
│   └── classificador_perfil.json
├── scripts/
│   ├── __init__.py
│   ├── validation.py             # validação e limpeza (antes do Algoritmo 1)
│   ├── text_utils.py             # normalização de descrições
│   ├── confidence.py             # tratamento de confiança (depois do Algoritmo 1)
│   ├── feature_engineering.py    # engenharia de indicadores (antes do Algoritmo 2)
│   ├── scoring.py                # score de saúde financeira + nível de risco
│   ├── explainability.py         # explicabilidade (depois do Algoritmo 2)
│   ├── recommendations.py        # motor de recomendações
│   ├── dashboard.py              # monta o JSON final do dashboard
│   ├── model_registry.py         # versionamento de modelos + metadados
│   │
│   ├── algorithm1/
│   │   ├── __init__.py
│   │   ├── dataset_transacoes.py     # geração do dataset simulado
│   │   └── model_transacoes.py       # treino + classificação de transações
│   │
│   ├── algorithm2/
│   │   ├── __init__.py
│   │   ├── dataset_perfil.py         # geração do dataset simulado
│   │   └── model_perfil.py           # treino + classificação de perfil
│   │
│   └── pipeline/
│       ├── __init__.py
│       └── pipeline_completo.py      # orquestra o fluxograma completo
│
├── api/
│   ├── __init__.py
│   └── main.py                # FastAPI - serviço consumido pelo Spring Boot
│
├── tests/
│   ├── __init__.py
│   ├── test_validation.py
│   ├── test_algorithm1.py
│   ├── test_algorithm2.py
│   ├── test_feature_engineering.py
│   └── test_pipeline.py
│
├── train.py                   # treina e salva os dois algoritmos
├── predict.py                  # exemplo end-to-end via CLI
├── requirements.txt
├── pytest.ini
├── Dockerfile
└── README.md
```

---

## 7. JSON final do Dashboard

```json
{
  "usuario_id": "user-001",
  "periodo": {
    "inicio": "2026-07-01",
    "fim": "2026-07-31"
  },
  "visao_geral": {
    "renda_mensal_liquida": 4500.0,
    "despesa_total": 3760.0,
    "margem_sobra": 740.0,
    "percentual_sobra": 16.44
  },
  "comportamento": {
    "distribuicao_categorias": {
      "alimentacao": 1250.0,
      "moradia": 1100.0,
      "transporte": 620.0,
      "lazer": 430.0,
      "saude": 360.0
    },
    "ranking_gastos": [
      {
        "posicao": 1,
        "categoria": "alimentacao",
        "valor": 1250.0,
        "percentual": 33.24
      },
      {
        "posicao": 2,
        "categoria": "moradia",
        "valor": 1100.0,
        "percentual": 29.26
      }
    ]
  },
  "saude_risco": {
    "perfil_financeiro": "em_observacao",
    "score_saude_financeira": 64,
    "probabilidade": 0.82,
    "nivel_risco": "moderado",
    "nivel_endividamento": 25.0,
    "comprometimento_renda": 83.56,
    "taxa_poupanca": 8.0
  },
  "recomendacoes_financeiras": {
    "frase_principal": "Sua situação financeira exige atenção moderada.",
    "bullet_points": [
      "Reduza gastos não essenciais.",
      "Revise despesas recorrentes.",
      "Aumente gradualmente sua reserva mensal."
    ]
  },
  "modelos": {
    "classificador_transacoes": "v1.0.0",
    "classificador_perfil": "v1.0.0"
  }
}
```

---

## 8. Como executar

```bash
cd ml
pip install -r requirements.txt

# Treina e versiona os dois algoritmos (compara 4 e 3 modelos, respectivamente)
python train.py

# Roda o pipeline completo com um exemplo real, imprime o JSON final
python predict.py

# Executa os testes automatizados
pytest -v

# Sobe o serviço FastAPI (consumido pelo Spring Boot)
uvicorn ml.api.main:app --reload --port 8000
```

Documentação interativa da API: `http://localhost:8000/docs`

**Endpoint principal:** `POST /analise-financeira`

- **Entrada:** renda mensal, endividamento, poupança, reserva e lista de transações
- **Saída:** JSON completo do dashboard (visão geral, comportamento, saúde e risco, recomendações)

---

## 9. Integração com o backend

- O Spring Boot **nunca** carrega `.joblib`/`.pkl` diretamente.
- Toda comunicação ocorre via HTTP REST com o FastAPI (`ml/api/main.py`).
- Conversar com a equipe de backend (estrutura idêntica ao JSON final especificado no documento de arquitetura).

---

## 10. Próximos passos

- Persistência de histórico por período (comparação mês a mês)
- Re-treinamento periódico com dados reais dos usuários (feedback loop)
- Monitoramento de drift dos modelos em produção

