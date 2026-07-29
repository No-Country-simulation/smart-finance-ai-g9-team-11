package br.com.financeai.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

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
