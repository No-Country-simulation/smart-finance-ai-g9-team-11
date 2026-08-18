# 🤝 Contributing Guide

Obrigado por contribuir com o **Finance AI**!

Este documento descreve o fluxo de trabalho adotado pela equipe durante o desenvolvimento do projeto.

---

# 📌 Fluxo de Desenvolvimento

Sempre trabalharemos utilizando a seguinte estrutura de branches:

```
main
│
develop
│
├── feature/backend-analysis
├── feature/backend-validation
├── feature/frontend-dashboard
├── feature/frontend-transactions
├── feature/ml-nlp-transactions
├── feature/ml-profile-risk
├── feature/oci-storage
├── feature/docs-readme
└── feature/devops-ci
```

## main

Branch estável.

Nunca faça commits diretamente nela.

---

## develop

Branch de integração.

Todas as funcionalidades serão integradas aqui antes de irem para a `main`.

---

## feature/*

Cada nova funcionalidade deve possuir sua própria branch.

Exemplos:

```
feature/backend-analysis

feature/frontend-dashboard

feature/ml-classification
```

Após finalizar a tarefa, abra um Pull Request para `develop`.

---

# 🚀 Como começar uma nova tarefa

## 1 Atualize a develop

```bash
git checkout develop

git pull origin develop
```

---

## 2 Crie uma nova branch

```bash
git checkout -b feature/nome-da-feature
```

Exemplo

```bash
git checkout -b feature/frontend-dashboard
```

---

## 3 Desenvolva normalmente

Faça suas alterações.

---

## 4 Verifique os arquivos alterados

```bash
git status
```

---

## 5 Adicione os arquivos

Todos

```bash
git add .
```

Ou apenas um arquivo

```bash
git add src/components/Dashboard.tsx
```

---

## 6 Faça um commit

Utilizamos o padrão **Conventional Commits**.

### Nova funcionalidade

```bash
git commit -m "feat: create dashboard cards"
```

### Correção

```bash
git commit -m "fix: validate transaction value"
```

### Documentação

```bash
git commit -m "docs: update README"
```

### Refatoração

```bash
git commit -m "refactor: simplify finance service"
```

### Testes

```bash
git commit -m "test: add finance service tests"
```

### Configuração

```bash
git commit -m "chore: configure docker"
```

---

## 7 Envie para o GitHub

Primeiro push

```bash
git push -u origin feature/frontend-dashboard
```

Depois

```bash
git push
```

---

## 8 Abra um Pull Request

Sempre abra um Pull Request para a branch **develop**.

Título do PR

```
feat: create dashboard cards
```

Descrição

```
## O que foi feito

- Criado Dashboard
- Criados Cards
- Layout Responsivo

Closes #12
```

---

# 📦 Padrão de Commits

| Tipo | Quando usar |
|-------|-------------|
| feat | Nova funcionalidade |
| fix | Correção de bug |
| docs | Documentação |
| refactor | Refatoração |
| style | Formatação |
| test | Testes |
| chore | Configuração |

---

# ✅ Exemplos

Backend

```
feat: create financial analysis endpoint
```

Frontend

```
feat: create transaction form
```

Machine Learning

```
feat: train transaction classification model
```

OCI

```
feat: integrate object storage
```

Documentação

```
docs: add architecture documentation
```

DevOps

```
chore: configure github actions
```

---

# 🚫 Evite

Nunca utilize commits como:

```
update

teste

arrumei

projeto

final

commit

ajustes
```

Esses commits não explicam o que foi alterado.

---

# ✅ Prefira

```
feat: add recommendation card

fix: validate negative values

docs: update API documentation

refactor: simplify recommendation service
```

---

# 🔄 Fluxo de Trabalho

```
Atualizar develop

↓

Criar feature

↓

Desenvolver

↓

Commit

↓

Push

↓

Pull Request

↓

Code Review

↓

Merge em develop

↓

Fim da Sprint

↓

Merge para main
```

---

# 📋 Boas Práticas

- Faça commits pequenos e frequentes.
- Escreva mensagens claras.
- Nunca faça commit diretamente na `main`.
- Atualize sua branch antes de começar uma nova tarefa.
- Sempre abra um Pull Request para revisão.
- Em caso de dúvidas, converse com o Tech Lead antes de fazer o merge.

---

# 💡 Dica

Um bom commit responde à pergunta:

> **"O que foi feito?"**

Exemplo:

```
feat: create financial profile endpoint
```

Um commit ruim:

```
arrumei tudo
```

Se outra pessoa conseguir entender a mudança apenas lendo a mensagem do commit, ela está bem escrita.
