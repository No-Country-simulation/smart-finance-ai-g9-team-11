package br.com.financeai.integration.dto.request;

import br.com.financeai.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MlTransactionRequest(

        LocalDate date,
        String description,
        BigDecimal amount,
        TransactionType type,
        String category
) {
}
