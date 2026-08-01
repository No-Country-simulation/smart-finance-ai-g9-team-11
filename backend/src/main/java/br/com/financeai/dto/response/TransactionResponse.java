package br.com.financeai.dto.response;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Representação pública de uma transação.
 *
 * O objeto AppUser não é retornado para evitar exposição de
 * informações sensíveis, como senha e dados internos da entidade.
 */
public record TransactionResponse(

        Long id,

        String descricao,

        BigDecimal valor,

        TransactionType tipo,

        TransactionCategory categoria,

        LocalDate data,

        Long usuarioId

) {
}