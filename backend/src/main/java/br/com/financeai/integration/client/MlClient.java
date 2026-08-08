package br.com.financeai.integration.client;

import br.com.financeai.exception.ExternalServiceException;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * Cliente responsável pela comunicação com o serviço de Machine Learning.
 *
 * <p>Esta classe realiza as chamadas HTTP para a API de IA, responsável
 * pela classificação de transações e pela análise do perfil financeiro.
 * Em caso de indisponibilidade do serviço, lança
 * {@link ExternalServiceException} para que a camada de serviço possa
 * executar o mecanismo de fallback.</p>
 */
@Slf4j
@Service
public class MlClient {

    private static final String ML_CONNECTION_ERROR = "Não foi possível conectar ao serviço de Machine Learning.";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public MlClient(RestClient restClient, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    /**
     * Envia os dados financeiros para o serviço de Machine Learning
     * responsável pela análise do perfil financeiro do usuário.
     *
     * @param request dados financeiros que serão enviados para a API de ML.
     * @return resposta contendo o perfil financeiro, resumo dos gastos,
     *         recomendações e demais indicadores calculados pelo modelo.
     * @throws ExternalServiceException caso o serviço de Machine Learning
     *         esteja indisponível ou retorne uma resposta inválida.
     */
    public MlResponse analyze(MlRequest request) {

        try {

            logRequest("JSON da análise enviado ao ML:", request);

            MlResponse response = restClient.post()
                    .uri("/analise-financeira")
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
            log.error(
                    "Erro ao chamar /analise-financeira. Status: {} - Body: {}",
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString()
            );

            throw new ExternalServiceException(
                    "O serviço de Machine Learning retornou um erro.",
                    ex
            );

        } catch (ResourceAccessException ex) {

            log.error("{}: {}", ML_CONNECTION_ERROR, ex.getMessage());

            throw new ExternalServiceException(
                    "Não foi possível conectar ao serviço de Machine Learning.",
                    ex
            );
        }
    }

    /**
     * Envia transações para o serviço de Machine Learning para
     * classificação automática da categoria.
     *
     * @param request transação que será classificada.
     * @return transações contendo a categoria identificada pelo modelo de IA.
     * @throws ExternalServiceException caso o serviço de Machine Learning
     *         esteja indisponível ou retorne uma resposta inválida.
     */
    public MlTransactionResponse classifyTransaction(
            MlTransactionRequest request
    ) {

        try {

            logRequest("JSON da transação enviado ao ML:", request);

            MlTransactionResponse response = restClient.post()
                    .uri("/classificar-transacoes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(MlTransactionResponse.class);

            if (response == null) {
                throw new ExternalServiceException(
                        "O serviço de Machine Learning retornou uma classificação vazia."
                );
            }

            return response;

        } catch (RestClientResponseException ex) {

            log.error(
                    "Erro ao chamar /classificar-transacoes. Status: {} - Body: {}",
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString()
            );

            throw new ExternalServiceException(
                    "O serviço de Machine Learning retornou um erro.",
                    ex
            );

        } catch (ResourceAccessException ex) {

            log.error("{}: {}", ML_CONNECTION_ERROR, ex.getMessage());

            throw new ExternalServiceException(
                    "Não foi possível conectar ao serviço de Machine Learning.",
                    ex
            );
        }
    }

    private void logRequest(String mensagem, Object body) {
        try {
            log.debug("{} {}", mensagem, objectMapper.writeValueAsString(body));
        } catch (JsonProcessingException ex) {
            log.warn("Não foi possível serializar o JSON.", ex);
        }
    }
}