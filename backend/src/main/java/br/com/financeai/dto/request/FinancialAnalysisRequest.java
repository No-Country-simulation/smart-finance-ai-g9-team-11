package br.com.financeai.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** Período (data inicial e final) para o qual uma análise financeira será gerada. */
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
) {
    @JsonIgnore
    @AssertTrue(message = "A data inicial não pode ser posterior à data final.")
    public boolean isPeriodoValido(){
        if(dataInicial == null || dataFinal == null){
            return true;
        }

        return !dataInicial.isAfter(dataFinal);
    }
}
