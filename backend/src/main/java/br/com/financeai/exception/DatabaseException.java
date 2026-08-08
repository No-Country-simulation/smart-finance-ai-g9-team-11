package br.com.financeai.exception;

/**
 * Lançada quando uma operação de banco de dados falha de forma prevista
 * (ex: violação de unicidade detectada por condição de corrida), com uma
 * mensagem já pensada para ser exibida ao usuário final.
 */
public class DatabaseException extends RuntimeException {
    public DatabaseException(String message) {
        super(message);
    }

    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
