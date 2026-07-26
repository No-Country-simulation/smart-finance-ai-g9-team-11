package br.com.financeai.dto.request;

import br.com.financeai.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Dados recebidos para atualização completa de uma transação.
 *
 * Como o endpoint utilizará PUT, todos os campos permanecem
 * obrigatórios nesta primeira versão do CRUD.
 */
public record UpdateTransactionRequest(

        @NotBlank(message = "A descrição da transação é obrigatória.")
        @Size(
                max = 255,
                message = "A descrição da transação deve possuir no máximo 255 caracteres."
        )
        String descricao,

        @NotNull(message = "O valor da transação é obrigatório.")
        @Positive(message = "O valor da transação deve ser maior que zero.")
        BigDecimal valor,

        @NotNull(message = "O tipo da transação é obrigatório.")
        TransactionType tipo,

        @NotNull(message = "A data da transação é obrigatória.")
        @PastOrPresent(
                message = "A data da transação não pode estar no futuro."
        )
        LocalDate dataTransacao

) {
}