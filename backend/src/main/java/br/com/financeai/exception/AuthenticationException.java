package br.com.financeai.exception;

/**
 * Lançada quando a autenticação falha — credenciais inválidas ou conta
 * desativada. Traduz exceções do Spring Security para o padrão de
 * exceção de domínio usado pelo restante da aplicação.
 */
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}
