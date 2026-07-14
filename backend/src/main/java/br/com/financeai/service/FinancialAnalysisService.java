package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.integration.client.MlServiceClient;
import br.com.financeai.integration.dto.MlResponse;
import org.springframework.stereotype.Service;

@Service
public class FinancialAnalysisService {

    private MlServiceClient mlServiceClient;

    public FinancialAnalysisService(MlServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }

    public FinancialAnalysisResponse analyze(FinancialAnalysisRequest request){

        MlResponse mlResponse = mlServiceClient.analyze(request);

        return new FinancialAnalysisResponse(
                mlResponse.perfilFinanceiro(),
                mlResponse.probabilidade(),
                mlResponse.resumoGastos(),
                mlResponse.recomendacoes()

        );

    }
}
