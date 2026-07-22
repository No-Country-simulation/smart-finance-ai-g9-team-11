package br.com.financeai.integration.dto.response;

import br.com.financeai.enums.TransactionCategory;

import java.math.BigDecimal;

public record MlTransactionResponse(

        String descricao,

        BigDecimal valor,

        TransactionCategory categoria) {
}
