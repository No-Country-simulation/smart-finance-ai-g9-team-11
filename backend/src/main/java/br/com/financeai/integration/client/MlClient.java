package br.com.financeai.integration.client;

import br.com.financeai.exception.ExternalServiceException;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Service
public class MlClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public MlClient(
            RestClient restClient,
            ObjectMapper objectMapper
    ) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public MlResponse analyze(MlRequest request) {

        try {
            System.out.println(
                    "JSON da análise enviado ao ML: "
                            + objectMapper.writeValueAsString(request)
            );

            MlResponse response = restClient.post()
                    .uri("/api/v1/financial-analysis")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(MlResponse.class);

            if (response == null) {
                throw new ExternalServiceException(
                        "O serviço de Machine Learning retornou uma resposta vazia."
                );
            }

            return response;

        } catch (RestClientResponseException ex) {
            System.err.println("Status retornado pelo ML: "
                    + ex.getStatusCode());

            System.err.println("Resposta retornada pelo ML: "
                    + ex.getResponseBodyAsString());

            throw new ExternalServiceException(
                    "O ML rejeitou a análise: "
                            + ex.getResponseBodyAsString()
            );

        } catch (JsonProcessingException ex) {
            throw new ExternalServiceException(
                    "Não foi possível visualizar o JSON da análise."
            );

        } catch (ExternalServiceException ex) {
            throw ex;

        } catch (Exception ex) {
            ex.printStackTrace();

            throw new ExternalServiceException(
                    "Não foi possível realizar a análise financeira no serviço de Machine Learning."
            );
        }
    }

    public MlTransactionResponse classifyTransaction(
            MlTransactionRequest request
    ) {
        try {
            String json = objectMapper.writeValueAsString(request);
            System.out.println(
                    "JSON da transação enviado ao ML: "
                            + objectMapper.writeValueAsString(request)
            );

            MlTransactionResponse response = restClient.post()
                    .uri("/classificar-transacoes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(json)
                    .retrieve()
                    .body(MlTransactionResponse.class);

            if (response == null) {
                throw new ExternalServiceException(
                        "O serviço de Machine Learning retornou uma classificação vazia."
                );
            }

            return response;

        } catch (RestClientResponseException ex) {
            System.err.println("Status retornado pelo ML: "
                    + ex.getStatusCode());

            System.err.println("Resposta retornada pelo ML: "
                    + ex.getResponseBodyAsString());

            throw new ExternalServiceException(
                    "O ML rejeitou a transação: "
                            + ex.getResponseBodyAsString()
            );

        } catch (JsonProcessingException ex) {
            throw new ExternalServiceException(
                    "Não foi possível visualizar o JSON da transação."
            );

        } catch (ExternalServiceException ex) {
            throw ex;

        } catch (Exception ex) {
            ex.printStackTrace();

            throw new ExternalServiceException(
                    "Não foi possível acessar o serviço de Machine Learning."
            );
        }
    }
}