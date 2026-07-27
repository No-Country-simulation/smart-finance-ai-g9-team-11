package br.com.financeai.integration.dto.request;

import java.util.List;

public record MlRequest(
        List<MlTransactionRequest> transactions
) {
}

