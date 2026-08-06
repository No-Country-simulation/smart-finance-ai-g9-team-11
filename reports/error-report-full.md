# Relatório de Erros Completo - Projeto Smart Finance AI

Data: 2026-08-05

## Resumo
- Escopo: todos os erros detectados automaticamente no workspace do projeto.
- Tecnologias analisadas: frontend TypeScript/React e backend Java/Spring.
- Status: relatório completo gerado com 20 erros detectados em 18 arquivos.

## Erros Encontrados

### frontend/src/providers/AuthProvider.tsx
- Erro: Module '"@/contexts/AuthContext"' has no exported member 'AuthContextProvider'.
- Tipo: import/exports incorretos.
- Ação recomendada: verificar `frontend/src/contexts/AuthContext.tsx` e exportar `AuthContextProvider`, ou ajustar o import para o nome correto.

### frontend/src/hooks/useAuth.ts
- Erro: Module '"@/contexts/AuthContext"' has no exported member 'AuthContext'.
- Tipo: import/exports incorretos.
- Ação recomendada: exportar `AuthContext` ou ajustar o hook para usar o nome correto.

### frontend/src/routes/PrivateRoute.tsx
- Erro: Property 'isAuthenticated' does not exist on type '{}'.
- Erro: Property 'isLoading' does not exist on type '{}'.
- Tipo: tipagem de objeto inválida.
- Ação recomendada: declarar tipagem correta no hook/contexto usado, que deve expor `isAuthenticated` e `isLoading`.

### backend/src/main/java/br/com/financeai/exception/GlobalExceptionHandler.java
- Erro: Null type safety: parameter 'this' provided via method descriptor Function<FieldError,String>.apply(FieldError) needs unchecked conversion to conform to '@NonNull DefaultMessageSourceResolvable'.
- Tipo: null-safety / Lambda method reference.
- Ação recomendada: substituir `FieldError::getDefaultMessage` por lambda com tratamento de null ou usar `Objects.requireNonNull`.

### backend/src/main/java/br/com/financeai/controller/AutenticacaoController.java
- Erro: The import br.com.financeai.dto.request.UserRegisterDto is never used.
- Erro: The import br.com.financeai.dto.response.UserResponseDto is never used.
- Erro: The import org.springframework.web.util.UriComponentsBuilder is never used.
- Tipo: imports não usados.
- Ação recomendada: remover imports não usados ou usar as classes se necessárias.

### backend/src/main/java/br/com/financeai/integration/dto/response/MlTransactionResponse.java
- Erro: The import com.fasterxml.jackson.annotation.JsonProperty is never used.
- Tipo: import não usado.
- Ação recomendada: remover import ou aplicar `@JsonProperty` aos campos.

### backend/src/main/java/br/com/financeai/config/RestClientConfig.java
- Erro: Null type safety: The expression of type 'String' needs unchecked conversion to conform to '@NonNull String'.
- Tipo: null-safety em `baseUrl(url)`.
- Ação recomendada: validar `url` não nulo antes do uso.

### backend/src/main/java/br/com/financeai/service/FinancialAnalysisService.java
- Erro: The import br.com.financeai.integration.dto.request.MlTransactionRequest is never used.
- Erro: The value of the local variable appUser is not used.
- Tipo: import/variável não usados.
- Ação recomendada: remover imports/variáveis não usados ou utilizar `appUser` conforme intenção.

### backend/src/main/java/br/com/financeai/integration/dto/request/MlTransactionRequest.java
- Erro: The import com.fasterxml.jackson.annotation.JsonProperty is never used.
- Tipo: import não usado.
- Ação recomendada: remover import ou aplicar anotação nos campos.

### backend/src/main/java/br/com/financeai/enums/TransactionCategory.java
- Erro: The import com.fasterxml.jackson.annotation.JsonCreator is never used.
- Tipo: import não usado.
- Ação recomendada: remover import.

### backend/src/main/java/br/com/financeai/security/SecurityFilter.java
- Erro: Missing non-null annotation: inherited method from OncePerRequestFilter specifies this parameter as @NonNull.
- Tipo: assinatura de método herdado.
- Ação recomendada: anotar parâmetros com `@NonNull` ou ajustar a assinatura para corresponder ao superclass.

### backend/src/main/java/br/com/financeai/integration/client/MlClient.java
- Erro: The import br.com.financeai.dto.response.ExpenseSummaryResponse is never used.
- Erro: The import br.com.financeai.enums.FinancialProfile is never used.
- Erro: The import br.com.financeai.enums.SavingFrequency is never used.
- Erro: The import br.com.financeai.enums.TransactionCategory is never used.
- Erro: The import java.math.BigDecimal is never used.
- Erro: The import java.util.List is never used.
- Erro: Null type safety: The expression of type 'MediaType' needs unchecked conversion to conform to '@NonNull MediaType'.
- Erro: Null type safety: The expression of type 'MlRequest' needs unchecked conversion to conform to '@NonNull Object'.
- Erro: Null type safety: The expression of type 'MediaType' needs unchecked conversion to conform to '@NonNull MediaType'.
- Erro: Null type safety: The expression of type 'String' needs unchecked conversion to conform to '@NonNull Object'.
- Tipo: imports não usados e null-safety em chamadas WebClient.
- Ação recomendada: limpar imports não usados; garantir que `MediaType`, `request` e `json` sejam não nulos.

### backend/src/main/java/br/com/financeai/service/TransactionService.java
- Erro: Null type safety: The expression of type 'List<Transaction>' needs unchecked conversion to conform to '@NonNull Iterable<Transaction>'.
- Erro: Null type safety: The expression of type 'Transaction' needs unchecked conversion to conform to '@NonNull Transaction'.
- Erro: Null type safety: The expression of type 'Long' needs unchecked conversion to conform to '@NonNull Long'.
- Tipo: null-safety em operações de repositório.
- Ação recomendada: validar entradas/retornos, evitar valores nulos ou anotar corretamente.

### backend/src/main/java/br/com/financeai/controller/FinancialAnalysisController.java
- Erro: The import java.util.List is never used.
- Tipo: import não usado.
- Ação recomendada: remover import.

### backend/pom.xml
- Erro: Project configuration is not up-to-date with pom.xml, requires an update.
- Tipo: configuração do projeto.
- Ação recomendada: executar `./mvnw -U` e reimportar dependências no IDE.

### backend/src/main/java/br/com/financeai/service/UserService.java
- Erro: The import jakarta.validation.Valid is never used.
- Erro: Null type safety: The expression of type 'Long' needs unchecked conversion to conform to '@NonNull Long'.
- Erro: Null type safety: The expression of type 'Long' needs unchecked conversion to conform to '@NonNull Long'.
- Tipo: import não usado e null-safety em chamadas `findById`.
- Ação recomendada: remover import não usado; validar `usuarioLogado.getId()` antes do uso.

## Total de arquivos com problemas
- 18 arquivos afetados.

## Total de erros detectados
- 20 erros reportados.

## Próximas ações sugeridas
1. Ajustar `AuthContext`/exports no frontend antes de rodar `npx tsc --noEmit`.
2. Remover imports não usados no backend e dissolver avisos de null-safety com validações/annotations.
3. Executar `backend\mvnw.cmd clean package` após as correções.
4. Reimportar o projeto no IDE se a mensagem de configuração do `pom.xml` persistir.

---

Relatório gerado automaticamente a partir da inspeção de erros do workspace.
