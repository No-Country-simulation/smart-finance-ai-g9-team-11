package br.com.financeai.dto.response;

import br.com.financeai.enums.FinancialProfile;

import java.util.List;

public record FinancialAnalysisResponse(
        FinancialProfile perfilFinanceiro,
        Double probabilidade,
        ExpenseSummaryResponse resumoGastos,
        List<String> recomendacoes
) {}
