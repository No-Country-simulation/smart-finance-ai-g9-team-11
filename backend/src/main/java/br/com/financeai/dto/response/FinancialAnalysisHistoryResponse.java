package br.com.financeai.dto.response;

import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FinancialAnalysisHistoryResponse(

        Long id,

        BigDecimal nivelEndividamento,

        SavingFrequency frequenciaPoupanca,

        FinancialProfile perfilFinanceiro,

        BigDecimal probabilidade,

        LocalDate dataAnalise

) {

    public FinancialAnalysisHistoryResponse(FinancialAnalysis analysis) {
        this(
                analysis.getId(),
                analysis.getNivelEndividamento(),
                analysis.getFrequenciaPoupanca(),
                analysis.getPerfilFinanceiro(),
                analysis.getProbabilidade(),
                analysis.getDataAnalise()
        );
    }
}