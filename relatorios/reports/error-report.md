# Relatório de Erros - Projeto Smart Finance AI

Data: 2026-08-05

Resumo executivo
- Escopo: verificação automática de erros de compilação e lint nos diretórios `frontend/` e `backend/`.
- Resultado: múltiplos problemas de tipagem no frontend (exports/typings) e vários problemas no backend (imports não usados, avisos de null-safety, anotações faltantes).

Principais recomendações
- Corrigir exportações e tipos do `AuthContext` no frontend para restaurar `AuthContext` e `AuthContextProvider`.
- Rodar checagem TypeScript no frontend (`npx tsc --noEmit`) e aplicar correções de tipagem/props.
- No backend (Java): remover imports não usados, validar nulos antes de chamadas que requerem `@NonNull`, e reexecutar o build Maven (`./mvnw.cmd clean package`).

Lista de problemas detectados (resumido por arquivo)

- frontend/src/providers/AuthProvider.tsx
  - Erro: Module '"@/contexts/AuthContext"' has no exported member 'AuthContextProvider'.
  - Sugestão: Verificar e exportar `AuthContextProvider` em `frontend/src/contexts/AuthContext.tsx` ou ajustar import.

- frontend/src/hooks/useAuth.ts
  - Erro: Module '"@/contexts/AuthContext"' has no exported member 'AuthContext'.
  - Sugestão: Exportar `AuthContext` ou ajustar o hook para usar o nome correto.

- frontend/src/routes/PrivateRoute.tsx
  - Erros: `isAuthenticated` e `isLoading` não existem no tipo inferido ({}).
  - Sugestão: Corrigir a tipagem do retorno do hook/contexto (`useAuth`) e declarar tipos apropriados.

- backend/src/main/java/br/com/financeai/exception/GlobalExceptionHandler.java
  - Erro: Null type safety ao usar `FieldError::getDefaultMessage` em map.
  - Sugestão: Substituir por `.map(e -> e.getDefaultMessage())` com checagem de null ou usar `Objects.requireNonNull` conforme convenção do projeto.

- backend/src/main/java/br/com/financeai/controller/AutenticacaoController.java
  - Erros: imports não usados: `UserRegisterDto`, `UserResponseDto`, `UriComponentsBuilder`.
  - Sugestão: Remover imports não usados ou usar as classes quando necessárias.

- backend/src/main/java/br/com/financeai/integration/dto/response/MlTransactionResponse.java
  - Erro: import `JsonProperty` não usado.
  - Sugestão: Remover import ou aplicar a anotação em campos necessários.

- backend/src/main/java/br/com/financeai/config/RestClientConfig.java
  - Erro: Null type safety em `.baseUrl(url)`.
  - Sugestão: Garantir `url` não-nulo antes do uso (validação/`Objects.requireNonNull`).

- backend/src/main/java/br/com/financeai/service/FinancialAnalysisService.java
  - Erros: import `MlTransactionRequest` não usado; variável local `appUser` não utilizada.
  - Sugestão: Remover código/importe não usado ou utilizar `appUser` conforme intenção.

- backend/src/main/java/br/com/financeai/integration/dto/request/MlTransactionRequest.java
  - Erro: import `JsonProperty` não usado.

- backend/src/main/java/br/com/financeai/enums/TransactionCategory.java
  - Erro: import `JsonCreator` não usado.

- backend/src/main/java/br/com/financeai/security/SecurityFilter.java
  - Erro: parâmetros de `doFilterInternal` sem anotação `@NonNull` (método herdado exige non-null).
  - Sugestão: Anotar parâmetros como `@NonNull` ou ajustar assinatura conforme biblioteca.

- backend/src/main/java/br/com/financeai/integration/client/MlClient.java
  - Erros: vários imports nunca usados; null-safety em `.contentType(...)` e `.body(...)`.
  - Sugestão: Remover imports não usados e garantir valores não-nulos antes de chamadas.

- backend/src/main/java/br/com/financeai/service/TransactionService.java
  - Erros: Null-safety em `saveAll`, `delete` e `findById`.
  - Sugestão: Validar argumentos/retornos, usar Optional com tratamento, ou anotações @NonNull.

- backend/src/main/java/br/com/financeai/controller/FinancialAnalysisController.java
  - Erro: import `java.util.List` não usado.

- backend/pom.xml
  - Erro: Projeto desatualizado em relação a `pom.xml` (requer atualização/reimport).
  - Sugestão: Executar `./mvnw -U` e reimportar dependências no IDE.

- backend/src/main/java/br/com/financeai/service/UserService.java
  - Erros: import `jakarta.validation.Valid` não usado; null-safety em chamadas com `usuarioLogado.getId()`.

Observações finais
- O relatório acima foi gerado automaticamente a partir das inspeções de compilação/lint do workspace. Se desejar, posso:
  - Gerar uma versão JSON estruturada (já criada ao lado deste arquivo).
  - Aplicar correções automáticas em arquivos específicos (p.ex., remover imports não usados, ajustar exports do frontend).
  - Rodar builds (`npx tsc`, `./mvnw clean package`) e anexar logs completos.

Arquivos gerados:
- `reports/error-report.md`
- `reports/error-report.json`
