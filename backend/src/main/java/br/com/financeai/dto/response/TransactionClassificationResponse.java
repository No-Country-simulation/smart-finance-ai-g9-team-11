package br.com.financeai.dto.response;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionClassificationResponse(

        String descricao,

        BigDecimal valor,

        TransactionType tipo,

        TransactionCategory categoria,

        LocalDate dataTransacao) {
}
