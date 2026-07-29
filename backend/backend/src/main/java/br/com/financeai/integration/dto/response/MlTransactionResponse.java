package br.com.financeai.integration.dto.response;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MlTransactionResponse(

        @JsonProperty("description")
        String descricao,

        @JsonProperty("amount")
        BigDecimal valor,

        @JsonProperty("type")
        TransactionType tipo,

        @JsonProperty("category")
        TransactionCategory categoria,

        @JsonProperty("date")
        LocalDate dataTransacao) {
}
