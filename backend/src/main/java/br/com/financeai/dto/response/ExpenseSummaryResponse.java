package br.com.financeai.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record ExpenseSummaryResponse(
        @JsonProperty("Alimentação")
        BigDecimal alimentacao,

        @JsonProperty("Moradia")
        BigDecimal moradia,

        @JsonProperty("Compras")
        BigDecimal compras,

        @JsonProperty("Entretenimento")
        BigDecimal entretenimento,

        @JsonProperty("Investimento")
        BigDecimal investimento,

        @JsonProperty("Salário")
        BigDecimal salario,

        @JsonProperty("Saúde")
        BigDecimal saude,

        @JsonProperty("Trajeto")
        BigDecimal trajeto,

        @JsonProperty("Utilitários")
        BigDecimal utilitarios,

        @JsonProperty("Outros")
        BigDecimal outros
) {}
