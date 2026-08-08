package br.com.financeai.exception;

/**
 * Lançada quando um recurso existe, mas não pertence ao usuário
 * autenticado — tratada como "não encontrado" na resposta, para não
 * expor a existência de dados de terceiros.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
