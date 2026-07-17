package br.com.financeai.integration.dto;

import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.enums.SavingFrequency;

import java.math.BigDecimal;
import java.util.List;

public record MlRequest(
        BigDecimal rendaMensal,

        Integer nivelEndividamento,

        SavingFrequency frequenciaPoupanca,

        List<TransactionRequest> transacoes
) {
}
