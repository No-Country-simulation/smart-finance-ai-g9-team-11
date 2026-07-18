package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.integration.client.MlServiceClient;
import br.com.financeai.integration.dto.MlRequest;
import br.com.financeai.integration.dto.MlResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class FinancialAnalysisService {

    private  MlServiceClient mlServiceClient;

    public FinancialAnalysisService(MlServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }

    public FinancialAnalysisResponse analyze(FinancialAnalysisRequest request) {

        if (request.transacoes().isEmpty()) {
            throw new InvalidRequestException(
                    "A lista de transações não pode estar vazia"
            );
        }
        if (request.rendaMensal().compareTo(BigDecimal.ZERO) == 0 &&
                request.transacoes().size() > 20) {

            throw new InvalidRequestException(
                    "Informação financeira inválida."
            );
        }
        // 1. Criamos o seu MlRequest pegando os dados limpos que vieram do controller
        MlRequest mlRequest = new MlRequest(
                request.rendaMensal(),
                request.nivelEndividamento(),
                request.frequenciaPoupanca(),
                request.transacoes()
        );

        // 2. Agora passamos o mlRequest (que o client espera receber)
        MlResponse mlResponse = mlServiceClient.analyze(mlRequest);

        return new FinancialAnalysisResponse(
                mlResponse.perfilFinanceiro(),
                mlResponse.probabilidade(),
                mlResponse.resumoGastos(),
                mlResponse.recomendacoes()
        );
    }

}
