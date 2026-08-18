package br.com.financeai.integration.dto.response;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Resposta do endpoint de classificação: os dados originais da
 * transação acrescidos da categoria determinada.
 */
public record MlTransactionResponse(

        String descricao,

        BigDecimal valor,

        TransactionType tipo,
  
        TransactionCategory categoria,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        LocalDate data) {
}
