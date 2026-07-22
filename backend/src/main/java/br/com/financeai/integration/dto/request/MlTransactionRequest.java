package br.com.financeai.integration.dto.request;

import java.math.BigDecimal;

public record MlTransactionRequest(

        String descricao,

        BigDecimal valor
) {
}
