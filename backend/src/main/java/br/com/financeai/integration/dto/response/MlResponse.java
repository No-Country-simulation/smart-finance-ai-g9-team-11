package br.com.financeai.integration.dto.response;

import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record MlResponse(
        FinancialProfile financialProfile,

        BigDecimal score,

        Map<String, BigDecimal> categorySummary,

        List<String> recommendations) {
}
