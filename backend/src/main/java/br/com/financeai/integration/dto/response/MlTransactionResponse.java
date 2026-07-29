package br.com.financeai.integration.dto.response;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MlTransactionResponse(
        String descricao,

        BigDecimal valor,

        TransactionType tipo,

        TransactionCategory categoria,

        LocalDate dataTransacao) {
}
