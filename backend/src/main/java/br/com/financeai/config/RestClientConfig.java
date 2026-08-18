package br.com.financeai.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

/**
 * Configura o {@link RestClient} usado pelo {@link br.com.financeai.integration.client.MlClient}
 * para se comunicar com o serviço de Machine Learning, com a URL base
 * definida pela propriedade {@code ml.api.url}.
 */
@Configuration
public class RestClientConfig {

    @Bean
    RestClient restClient(
            @Value("${ml.api.url}") String url) {

        return RestClient.builder()
                .baseUrl(url)
                .requestFactory(new SimpleClientHttpRequestFactory())
                .build();
    }

}
