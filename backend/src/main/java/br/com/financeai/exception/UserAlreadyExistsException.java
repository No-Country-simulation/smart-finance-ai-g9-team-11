package br.com.financeai.exception;

/**
 * Lançada ao tentar cadastrar um usuário com um e-mail já em uso por
 * uma conta ativa.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}