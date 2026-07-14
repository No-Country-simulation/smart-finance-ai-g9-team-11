"""
dataset_transacoes.py
GeraÃ§Ã£o do dataset sintÃ©tico de transaÃ§Ãµes rotuladas por categoria,
com ruÃ­do textual e de valores para simular dados reais.
"""

import numpy as np
import pandas as pd

CATEGORIAS_TEMPLATES = {
    "alimentacao": [
        "Supermercado Extra", "Pao de Acucar", "Restaurante Sabor Caseiro",
        "iFood Pedido", "Padaria Central", "Feira Livre", "Acougue Bom Corte",
        "Lanchonete Rapida", "Mercado Bom Preco", "Hortifruti Verde Vida",
        "Supermercado Mateus"
    ],
    "transporte": [
        "Uber Trip", "99 corrida", "Posto Ipiranga Combustivel",
        "Estacionamento Shopping", "Metro Bilhete Unico", "Onibus Municipal",
        "Pedagio Concessionaria", "Oficina Mecanica Motor", "Posto Shell",
        "Locadora de Veiculos"
    ],
    "saude": [
        "Farmacia Pague Menos", "Consulta Dr Silva", "Plano de Saude Unimed",
        "Exame Laboratorio Central", "Drogaria Sao Paulo", "Academia Smart Fit",
        "Clinica Odontologica", "Farmacia Drogasil", "Fisioterapia Sessao",
        "Farmacia"
    ],
    "moradia": [
        "Aluguel Apartamento", "Condominio Residencial", "Conta de Luz Enel",
        "Conta de Agua Sabesp", "Internet Vivo Fibra", "Gas Encanado",
        "Seguro Residencial", "Material de Construcao", "IPTU Prefeitura",
        "Conta de energia"
    ],
    "educacao": [
        "Mensalidade Faculdade", "Curso Online Udemy", "Livraria Cultura",
        "Material Escolar", "Curso de Ingles", "Mensalidade Escola",
        "Plataforma Alura", "Apostila Concurso", "Pos Graduacao EAD",
        "Certificacao Profissional"
    ],
    "lazer": [
        "Netflix Assinatura", "Cinema Shopping", "Spotify Premium",
        "Viagem Passagem Aerea", "Bar Happy Hour", "Show de Musica",
        "Parque de Diversoes", "Streaming Disney Plus", "Jogo Steam", "Netflix"
    ],
    "servicos": [
        "Assinatura Celular Vivo", "Manutencao Notebook", "Salao de Beleza",
        "Lavanderia Express", "Contador Mensalidade", "Assinatura Software",
        "Servico de Limpeza", "Advogado Consultoria", "Seguro de Vida",
        "Cartorio Documentos"
    ],
    "outras": [
        "Transferencia Pix Diversos", "Saque Caixa Eletronico", "Doacao ONG",
        "Compra Diversa Loja X", "Pagamento Boleto Diversos", "Presente Aniversario",
        "Multa de Transito", "Taxa Bancaria", "Deposito Conta Poupanca",
        "Compra Nao Identificada"
    ],
}

FAIXAS_VALORES = {
    "alimentacao": (15, 500), "transporte": (8, 300), "saude": (30, 800),
    "moradia": (100, 2500), "educacao": (50, 1200), "lazer": (15, 600),
    "servicos": (20, 400), "outras": (10, 1000),
}


def _gerar_ruido_texto(descricao: str, rng: np.random.Generator) -> str:
    prefixos = ["PGTO ", "COMPRA ", "DEB AUT ", "TED ", ""]
    sufixos_data = [" 08/07", " 12/07", " 25/06", ""]
    sufixos_codigo = [f" {rng.integers(10000, 99999)}", ""]
    return f"{rng.choice(prefixos)}{descricao}{rng.choice(sufixos_data)}{rng.choice(sufixos_codigo)}"


def gerar_dataset_transacoes_simulado(n_amostras: int = 1500, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    categorias = list(CATEGORIAS_TEMPLATES.keys())

    registros = []
    for _ in range(n_amostras):
        categoria = rng.choice(categorias)
        template = rng.choice(CATEGORIAS_TEMPLATES[categoria])
        descricao = _gerar_ruido_texto(template, rng)

        faixa_min, faixa_max = FAIXAS_VALORES[categoria]
        valor = round(float(rng.uniform(faixa_min, faixa_max)), 2)

        prob_recorrente = {
            "moradia": 0.85, "saude": 0.4, "servicos": 0.6,
            "educacao": 0.7, "lazer": 0.3, "alimentacao": 0.1,
            "transporte": 0.15, "outras": 0.05,
        }[categoria]
        recorrente = bool(rng.random() < prob_recorrente)

        registros.append({
            "descricao": descricao, "valor": valor,
            "categoria": categoria, "recorrente": recorrente,
        })

    return pd.DataFrame(registros)


