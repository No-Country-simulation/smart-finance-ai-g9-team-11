package br.com.financeai.service;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TransactionClassificationServiceTest {

    private final TransactionClassificationService service = new TransactionClassificationService();

    @Test
    void shouldClassifyIfoodAsAlimentacao() {
        MlTransactionRequest request = createRequest("iFood", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.ALIMENTACAO, response.categoria());
    }

    @Test
    void shouldClassifyUberAsTrajeto() {
        MlTransactionRequest request = createRequest("Uber", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.TRAJETO, response.categoria());
    }

    @Test
    void shouldClassifyFarmaciaAsSaude() {
        MlTransactionRequest request = createRequest("Farmacia Drogasil", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.SAUDE, response.categoria());
    }

    @Test
    void shouldClassifyNetflixAsEntretenimento() {
        MlTransactionRequest request = createRequest("Netflix", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.ENTRETENIMENTO, response.categoria());
    }

    @Test
    void shouldClassifyAmazonAsCompras() {
        MlTransactionRequest request = createRequest("Amazon", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.COMPRAS, response.categoria());
    }

    @Test
    void shouldClassifyInvestimentoAsInvestimento() {
        MlTransactionRequest request = createRequest("Investimento Nu Invest", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.INVESTIMENTO, response.categoria());
    }

    @Test
    void shouldClassifySalarioAsSalario() {
        MlTransactionRequest request = createRequest("Salário Empresa", TransactionType.RECEITA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.SALARIO, response.categoria());
    }

    @Test
    void shouldClassifyUnknownDescriptionAsOutros() {
        MlTransactionRequest request = createRequest("Coisa aleatoria sem categoria", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.OUTROS, response.categoria());
    }

    @Test
    void shouldClassifyBlankDescriptionAsOutros() {
        MlTransactionRequest request = createRequest("", TransactionType.DESPESA);

        MlTransactionResponse response = service.classifyTransactionFallback(request);

        assertEquals(TransactionCategory.OUTROS, response.categoria());
    }

    private MlTransactionRequest createRequest(String descricao, TransactionType tipo) {
        return new MlTransactionRequest(
                descricao,
                BigDecimal.valueOf(100.00),
                tipo,
                LocalDate.of(2026, 8, 12)
        );
    }
}
