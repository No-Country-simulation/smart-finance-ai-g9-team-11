package br.com.financeai.integration.client;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.integration.dto.MlResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MlServiceClient {

    public MlResponse analyze(FinancialAnalysisRequest request) {

        ExpenseSummaryResponse resumoGastos = new ExpenseSummaryResponse(
                new BigDecimal("420"), // alimentação
                new BigDecimal("300"), // transporte
                new BigDecimal("40") // entretenimento
                 );

        return new MlResponse(
                FinancialProfile.EM_OBSERVACAO,
                new Double("0.82"),
                resumoGastos,
                List.of(
                        "Monitorar gastos recorrentes de entretenimento",
                        "Aumentar reserva financeira mensal"
                )
        );
    }
}
