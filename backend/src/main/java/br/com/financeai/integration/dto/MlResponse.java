package br.com.financeai.integration.dto;

import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;

import java.math.BigDecimal;
import java.util.List;

public record MlResponse(
        FinancialProfile perfilFinanceiro,

        BigDecimal probabilidade,

        ExpenseSummaryResponse resumoGastos,

        List<String> recomendacoes) {
}
