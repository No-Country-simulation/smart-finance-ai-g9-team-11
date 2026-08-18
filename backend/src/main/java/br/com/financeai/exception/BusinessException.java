package br.com.financeai.exception;

/**
 * Lançada quando uma requisição viola uma regra de negócio do domínio
 * (ex: transação fora da janela de edição, análise com transações
 * insuficientes) — diferente de {@link InvalidRequestException}, que
 * cobre problemas estruturais do request, não regras de negócio.
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
