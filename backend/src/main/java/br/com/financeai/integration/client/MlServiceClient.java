package br.com.financeai.integration.client;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.integration.dto.MlResponse;
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

    public MlResponse analyze(FinancialAnalysisRequest request) {

        return restClient.post()
                .uri("/analise-financeira")
                .body(request)
                .retrieve()
                .body(MlResponse.class);

    }
}
