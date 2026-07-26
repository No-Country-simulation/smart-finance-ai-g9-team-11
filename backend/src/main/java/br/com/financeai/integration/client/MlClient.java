package br.com.financeai.integration.client;

import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MlClient {

    private final RestClient restClient;

    public MlClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public MlResponse analyze(MlRequest request) {

        //Mock resposta da análise financeira da API
        return new MlResponse(
                FinancialProfile.EM_OBSERVACAO,
                new BigDecimal("0.82"),
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

//       try {
//        System.out.println(request);
//        return restClient.post()
//                .uri("/analise-financeira")
//                .contentType(MediaType.APPLICATION_JSON)
//                .body(request)
//                .retrieve()
//                .body(MlResponse.class);
//
//        } catch (Exception ex) {
//           throw new ExternalServiceException("Serviço de Machine Learning Indisponível no momento.");
//       }

    }
    public MlTransactionResponse classifyTransaction(MlTransactionRequest request){
        //Mock da Classificao de transacoes
        return new MlTransactionResponse(
                request.descricao(),
                request.valor(),
                TransactionCategory.OUTROS
        );
    }
//        try {
//        return restClient.post()
//                .uri("/classificar-transacao")
//                .body(request)
//                .retrieve()
//                .body(MlTransactionResponse.class);
//    } catch(Exception ex){
//        throw new ExternalServiceException("Serviço de Machine Learning indisponível.");
//    }


}
