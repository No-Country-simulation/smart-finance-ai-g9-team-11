package br.com.financeai.integration.dto.request;

import br.com.financeai.integration.dto.response.MlTransactionResponse;

import java.util.List;

/**
 * Corpo da requisição enviada ao endpoint de análise financeira —
 * carrega as transações do período já classificadas (com categoria).
 */
public record MlAnalysisRequest(
        List<MlTransactionResponse> transactions
) {
}

