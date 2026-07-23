package br.com.financeai.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;


@JsonIgnoreProperties(ignoreUnknown = true)
public record FinancialAnalysisRequest(
        @NotNull(message = "A data inicial é obrigatória.")
        @JsonProperty("data_inicial")
        @JsonFormat(pattern = "yyyy-MM-dd")
       LocalDate dataInicial,

       @NotNull(message = "A data final é obrigatória.")
       @JsonProperty("data_final")
       @JsonFormat(pattern = "yyyy-MM-dd")
       LocalDate dataFinal
) {}
