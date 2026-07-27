package br.com.financeai.integration.dto.response;

import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record MlResponse(

        FinancialProfile financialProfile,

        Integer nivelEndividamento,

        SavingFrequency frequenciaPoupanca,

        BigDecimal probabilidade,

        ExpenseSummaryResponse resumoGastos,

        List<String> recommendations) {
}
