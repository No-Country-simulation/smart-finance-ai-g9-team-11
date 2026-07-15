package br.com.financeai.integration.client;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.integration.dto.MlRequest;
import br.com.financeai.integration.dto.MlResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MlServiceClient {

    private final RestClient restClient;

    public MlServiceClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public MlResponse analyze(MlRequest request) {

        return new MlResponse(
                FinancialProfile.EM_OBSERVACAO,
                new Double("0.82"),
                new ExpenseSummaryResponse(
                        new BigDecimal("420"),
                        new BigDecimal("300"),
                        new BigDecimal("40")
                ),
                List.of(
                        "Monitorar gastos recorrentes de entretenimento",
                        "Aumentar reserva financeira mensal"
                )
        );


//        System.out.println(request);
//        return restClient.post()
//                .uri("/analise-financeira")
//                .contentType(MediaType.APPLICATION_JSON)
//                .body(request)
//                .retrieve()
//                .body(MlResponse.class);

    }
}
