package br.com.financeai.dto.response;

import br.com.financeai.enums.FinancialProfile;

import java.math.BigDecimal;
import java.util.List;

public record FinancialAnalysisResponse(
        FinancialProfile perfilFinanceiro,

        BigDecimal probabilidade,

        ExpenseSummaryResponse resumoGastos,

        List<String> recomendacoes
) {}
