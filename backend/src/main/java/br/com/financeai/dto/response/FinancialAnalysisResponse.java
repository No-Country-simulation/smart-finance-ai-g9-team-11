package br.com.financeai.dto.response;

import java.util.List;

public record FinancialAnalysisResponse(
        String perfilFinanceiro,
        Double probabilidade,
        ExpenseSummaryResponse resumoGastos,
        List<String> recomendacoes
) {}
