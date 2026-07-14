"""
text_utils.py
NormalizaÃ§Ã£o de texto usada na classificaÃ§Ã£o das transaÃ§Ãµes.
"""

import re
import unicodedata


def remover_acentos(texto: str) -> str:
    nfkd = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def limpar_texto(texto) -> str:
    if not isinstance(texto, str):
        return ""

    texto = texto.lower()
    texto = remover_acentos(texto)
    texto = re.sub(r"\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b", " ", texto)
    texto = re.sub(r"\b\d{4,}\b", " ", texto)
    texto = re.sub(r"[^a-z0-9\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


