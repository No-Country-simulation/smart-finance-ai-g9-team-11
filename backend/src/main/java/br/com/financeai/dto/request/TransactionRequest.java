package br.com.financeai.dto.request;

import br.com.financeai.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
    @NotBlank(message = "A descrição da transação é obrigatória.")
    String descricao,

    @NotNull(message = "O valor da transação é obrigatório.")
    @Positive(message = "O valor da transação deve ser maior que zero.")
    BigDecimal valor,

    @NotNull(message = "O tipo é obrigatório.")
    TransactionType tipo,

    @NotNull(message = "A data da transação é obrigatória.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("data_transacao")
    LocalDate dataTransacao

) {}


