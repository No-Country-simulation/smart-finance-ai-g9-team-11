package br.com.financeai.dto.response;

import java.math.BigDecimal;

public record ExpenseSummaryResponse(
        BigDecimal alimentacao,
        BigDecimal moradia,
        BigDecimal compras,
        BigDecimal entretenimento,
        BigDecimal investimento,
        BigDecimal salario,
        BigDecimal saude,
        BigDecimal trajeto,
        BigDecimal utilitarios,
        BigDecimal outros
) {}
