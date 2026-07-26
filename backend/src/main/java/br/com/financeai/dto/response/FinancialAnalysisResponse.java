package br.com.financeai.dto.response;

import br.com.financeai.enums.FinancialProfile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record FinancialAnalysisResponse(
        FinancialProfile financialProfile,

        BigDecimal score,

        Map<String, BigDecimal> categorySummary,

        List<String> recommendation
) {}
