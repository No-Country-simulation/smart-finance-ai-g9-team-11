package br.com.financeai.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;

public record FinancialAnalysisRequest(
        @NotNull(message = "A renda mensal é obrigatória.")
        @PositiveOrZero(message = "A renda mensal não pode ser negativa.")
        BigDecimal rendaMensal,

        @NotNull(message = "O nível de endividamento é obrigatório.")
        @PositiveOrZero(message = "O nível de endividamento não pode ser negativo.")
        Integer nivelEndividamento,

        @NotBlank(message = "A frequência de poupança é obrigatória.")
        String frequenciaPoupanca,

        @NotNull(message = "A lista de transações não pode ser nula.")
        @Valid // Essencial para que o Spring valide os itens dentro da lista
        List<TransactionRequest> transacoes
) {}
