package br.com.financeai.exception;

import java.time.LocalDateTime;

/**
 * Corpo de resposta padronizado para todos os erros retornados pela API.
 */
public record ApiErrorResponse(
        LocalDateTime timestamp,

        Integer status,

        String error,

        String message,

        String path
) {
}
