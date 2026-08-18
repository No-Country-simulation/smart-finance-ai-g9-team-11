package br.com.financeai.exception;

/**
 * Lançada quando um recurso solicitado (usuário, transação, análise) não é
 * encontrado no banco de dados.
 */
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }

}
