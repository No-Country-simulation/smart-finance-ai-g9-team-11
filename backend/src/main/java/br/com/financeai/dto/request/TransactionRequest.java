package br.com.financeai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record TransactionRequest(
    @NotBlank(message = "A descrição da transação é obrigatória.")
    String descricao,

    @NotNull(message = "O valor da transação é obrigatório.")
    @Positive(message = "O valor da transação deve ser maior que zero.")
    BigDecimal valor
) {}


