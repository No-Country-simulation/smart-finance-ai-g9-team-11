package br.com.financeai.integration.dto;

import br.com.financeai.dto.request.TransactionRequest;

import java.math.BigDecimal;
import java.util.List;

public record MlRequest(
        BigDecimal rendaMensal,
        Integer nivelEndividamento,
        String frequenciaPoupanca,
        List<TransactionRequest> transacoes
) {
}
