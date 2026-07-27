package br.com.financeai.integration.client;

import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
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
                3,
                SavingFrequency.BAIXA,
                new BigDecimal("0.82"),
                new ExpenseSummaryResponse(
                        new BigDecimal("420"),
                        new BigDecimal("300"),
                        new BigDecimal("40"),
                        new BigDecimal ("100"),
                        new BigDecimal ("200"),
                        new BigDecimal ("150"),
                        new BigDecimal ("1000"),
                        new BigDecimal ("100"),
                        new BigDecimal ("200"),
                        new BigDecimal ("300")
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

        TransactionCategory categoria = inferirCategoria(request.descricao());

        return new MlTransactionResponse(
                request.descricao(),
                request.valor(),
                request.tipo(),
                categoria,
                request.dataTransacao()
        );
    }

    private TransactionCategory inferirCategoria(String descricao) {
        String texto = descricao.toLowerCase();

        if (texto.contains("supermercado") || texto.contains("mercado") || texto.contains("restaurante")) {
            return TransactionCategory.ALIMENTACAO;
        }
        if (texto.contains("uber") || texto.contains("combustivel") || texto.contains("onibus")) {
            return TransactionCategory.TRANSPORTE;
        }
        if (texto.contains("cinema") || texto.contains("netflix") || texto.contains("show")) {
            return TransactionCategory.ENTRETENIMENTO;
        }
        if (texto.contains("farmacia") || texto.contains("consulta") || texto.contains("plano de saude")) {
            return TransactionCategory.SAUDE;
        }
        if (texto.contains("aluguel") || texto.contains("condominio")) {
            return TransactionCategory.MORADIA;
        }

        return TransactionCategory.OUTROS;
    }
//        try {
//        return restClient.post()
//                .uri("/classificar-transacoes")
//                .body(request)
//                .retrieve()
//                .body(MlTransactionResponse.class);
//    } catch(Exception ex){
//        throw new ExternalServiceException("Serviço de Machine Learning indisponível.");
//    }


}
