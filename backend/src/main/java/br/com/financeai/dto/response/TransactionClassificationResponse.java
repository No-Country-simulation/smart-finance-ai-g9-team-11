package br.com.financeai.dto.response;

import br.com.financeai.enums.TransactionCategory;

import java.math.BigDecimal;

public record TransactionClassificationResponse(
        String descricao,

        BigDecimal valor,

        TransactionCategory categoria) {
}
