package br.com.financeai.dto.response;

import java.math.BigDecimal;

public record ExpenseSummaryResponse(
        BigDecimal alimentacao,
        BigDecimal transporte,
        BigDecimal entretenimento
) {}
