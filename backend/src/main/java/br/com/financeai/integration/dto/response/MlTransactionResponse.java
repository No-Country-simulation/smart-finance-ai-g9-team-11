package br.com.financeai.integration.dto.response;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MlTransactionResponse(

        String temporaryId,

        LocalDate date,

        String description,

        BigDecimal amount,

        TransactionType type,

        String category) {
}
