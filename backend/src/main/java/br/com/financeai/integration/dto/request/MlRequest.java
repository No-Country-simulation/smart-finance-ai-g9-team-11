package br.com.financeai.integration.dto.request;

import br.com.financeai.integration.dto.response.MlTransactionResponse;

import java.util.List;

public record MlRequest(
        List<MlTransactionResponse> transactions
) {
}

