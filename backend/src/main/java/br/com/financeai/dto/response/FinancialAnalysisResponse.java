package br.com.financeai.dto.response;

import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record FinancialAnalysisResponse(

        @JsonProperty("perfil_financeiro")
        FinancialProfile perfilFinanceiro,

        @JsonProperty("nivel_endividamento")
        BigDecimal nivelEndividamento,

        @JsonProperty("frequencia_poupanca")
        SavingFrequency frequenciaPoupanca,

        @JsonProperty("probabilidade")
        BigDecimal probabilidade,

        @JsonProperty("resumo_gastos")
        ExpenseSummaryResponse resumoGastos,

        @JsonProperty("recomendacoes")
        List<String> recomendacoes
) {}
