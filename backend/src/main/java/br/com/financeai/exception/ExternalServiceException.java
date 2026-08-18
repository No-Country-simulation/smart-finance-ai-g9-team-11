package br.com.financeai.exception;

/**
 * Lançada quando o serviço externo de Machine Learning está indisponível
 * ou retorna uma resposta inválida.
 */
public class ExternalServiceException extends RuntimeException {
    public ExternalServiceException(String message) {
        super(message);
    }

    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
