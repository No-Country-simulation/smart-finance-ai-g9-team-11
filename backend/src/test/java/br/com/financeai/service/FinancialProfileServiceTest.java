package br.com.financeai.service;

import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FinancialProfileServiceTest {

    private final FinancialProfileService service = new FinancialProfileService();

    @Test
    void shouldGenerateObservationProfileWhenExpensesAreLowerThanIncome() {
        List<Transaction> transactions = List.of(
                createTransaction("Salário", 1000.00, TransactionType.RECEITA, TransactionCategory.SALARIO),
                createTransaction("Mercado", 200.00, TransactionType.DESPESA, TransactionCategory.ALIMENTACAO)
        );

        FinancialAnalysisResponse response = service.gerarAnaliseFallback(transactions);

        assertEquals(FinancialProfile.EM_OBSERVACAO, response.perfilFinanceiro());
        assertBigDecimalEquals(BigDecimal.valueOf(20.00), response.nivelEndividamento());
        assertEquals(SavingFrequency.ALTA, response.frequenciaPoupanca());
        assertBigDecimalEquals(BigDecimal.ZERO, response.probabilidade());

        assertTrue(response.recomendacoes()
                .contains("Análise gerada em modo simplificado — serviço de IA indisponível no momento."));
    }

    @Test
    void shouldGenerateRiskProfileWhenExpensesAreGreaterThanIncome() {
        List<Transaction> transactions = List.of(
                createTransaction("Salário", 1000.00, TransactionType.RECEITA, TransactionCategory.SALARIO),
                createTransaction("Compras", 1200.00, TransactionType.DESPESA, TransactionCategory.COMPRAS)
        );

        FinancialAnalysisResponse response = service.gerarAnaliseFallback(transactions);

        assertEquals(FinancialProfile.EM_RISCO, response.perfilFinanceiro());
        assertBigDecimalEquals(BigDecimal.valueOf(120.00), response.nivelEndividamento());
        assertEquals(SavingFrequency.BAIXA, response.frequenciaPoupanca());

        assertTrue(response.recomendacoes()
                .contains("Suas despesas superaram suas receitas neste período."));
    }

    @Test
    void shouldCalculateExpenseSummaryByCategory() {
        List<Transaction> transactions = List.of(
                createTransaction("Mercado", 10.00, TransactionType.DESPESA, TransactionCategory.ALIMENTACAO),
                createTransaction("Aluguel", 20.00, TransactionType.DESPESA, TransactionCategory.MORADIA),
                createTransaction("Amazon", 30.00, TransactionType.DESPESA, TransactionCategory.COMPRAS),
                createTransaction("Netflix", 40.00, TransactionType.DESPESA, TransactionCategory.ENTRETENIMENTO),
                createTransaction("Investimento", 50.00, TransactionType.DESPESA, TransactionCategory.INVESTIMENTO),
                createTransaction("Farmácia", 60.00, TransactionType.DESPESA, TransactionCategory.SAUDE),
                createTransaction("Uber", 70.00, TransactionType.DESPESA, TransactionCategory.TRAJETO),
                createTransaction("Conta de luz", 80.00, TransactionType.DESPESA, TransactionCategory.UTILITARIOS),
                createTransaction("Outro gasto", 90.00, TransactionType.DESPESA, TransactionCategory.OUTROS),
                createTransaction("Salário", 1000.00, TransactionType.RECEITA, TransactionCategory.SALARIO)
        );

        ExpenseSummaryResponse response = service.calcularResumoGastos(transactions);

        assertBigDecimalEquals(BigDecimal.valueOf(10.00), response.alimentacao());
        assertBigDecimalEquals(BigDecimal.valueOf(20.00), response.moradia());
        assertBigDecimalEquals(BigDecimal.valueOf(30.00), response.compras());
        assertBigDecimalEquals(BigDecimal.valueOf(40.00), response.entretenimento());
        assertBigDecimalEquals(BigDecimal.valueOf(50.00), response.investimento());
        assertBigDecimalEquals(BigDecimal.ZERO, response.salario());
        assertBigDecimalEquals(BigDecimal.valueOf(60.00), response.saude());
        assertBigDecimalEquals(BigDecimal.valueOf(70.00), response.trajeto());
        assertBigDecimalEquals(BigDecimal.valueOf(80.00), response.utilitarios());
        assertBigDecimalEquals(BigDecimal.valueOf(90.00), response.outros());
    }

    private Transaction createTransaction(
            String descricao,
            double valor,
            TransactionType tipo,
            TransactionCategory categoria
    ) {
        Transaction transaction = new Transaction();
        transaction.setDescricao(descricao);
        transaction.setValor(BigDecimal.valueOf(valor));
        transaction.setTipo(tipo);
        transaction.setCategoria(categoria);
        transaction.setData(LocalDate.of(2026, 8, 12));
        return transaction;
    }

    private void assertBigDecimalEquals(BigDecimal expected, BigDecimal actual) {
        assertEquals(0, expected.compareTo(actual));
    }
}
