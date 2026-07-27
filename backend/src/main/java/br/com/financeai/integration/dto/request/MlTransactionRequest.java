package br.com.financeai.integration.dto.request;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MlTransactionRequest(

        String descricao,

        BigDecimal valor,

        TransactionType tipo,

        LocalDate dataTransacao
) {
}
