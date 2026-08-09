FROM python:3.11-slim

WORKDIR /app

# Copia o requirements que está dentro de ml/
COPY ml/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia toda a pasta ml para dentro de /app/ml no container
COPY ml/ ./ml/

EXPOSE 8000

# Adiciona /app/ml ao PYTHONPATH para que o Python ache a pasta interna
ENV PYTHONPATH=/app/ml

# Como a pasta api está em ml/api/main.py, o uvicorn aponta para api.main:app
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]