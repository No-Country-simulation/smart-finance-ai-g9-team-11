package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import br.com.financeai.enums.Source;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import br.com.financeai.exception.BusinessException;
import br.com.financeai.exception.ExternalServiceException;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlAnalysisRequest;
import br.com.financeai.integration.dto.response.MlAnalysisResponse;
import br.com.financeai.repository.FinancialAnalysisRepository;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FinancialAnalysisServiceTest {

    @Mock
    private FinancialProfileService financialProfileService;

    @Mock
    private MlClient mlClient;

    @Mock
    private FinancialAnalysisRepository financialAnalysisRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FinancialAnalysisService service;

    @Test
    void shouldAnalyzeUsingMlSuccessfully() {
        AppUser user = createUser();
        FinancialAnalysisRequest request = createRequest();

        List<Transaction> transactions = List.of(
                createTransaction("Salário", 5000.00, TransactionType.RECEITA, TransactionCategory.SALARIO),
                createTransaction("Mercado", 300.00, TransactionType.DESPESA, TransactionCategory.ALIMENTACAO),
                createTransaction("Uber", 50.00, TransactionType.DESPESA, TransactionCategory.TRAJETO)
        );

        ExpenseSummaryResponse summary = createExpenseSummary();

        MlAnalysisResponse mlResponse = new MlAnalysisResponse(
                FinancialProfile.SAUDAVEL,
                BigDecimal.valueOf(7.00),
                SavingFrequency.ALTA,
                BigDecimal.valueOf(0.80),
                summary,
                List.of("Continue mantendo seus gastos controlados.")
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(transactionRepository.findByUsuarioAndDataBetween(
                user,
                request.dataInicial(),
                request.dataFinal()
        )).thenReturn(transactions);
        when(mlClient.analyze(any(MlAnalysisRequest.class))).thenReturn(mlResponse);

        FinancialAnalysisResponse response = service.analyze(1L, request);

        assertEquals(FinancialProfile.SAUDAVEL, response.perfilFinanceiro());
        assertBigDecimalEquals(BigDecimal.valueOf(7.00), response.nivelEndividamento());
        assertEquals(SavingFrequency.ALTA, response.frequenciaPoupanca());
        assertBigDecimalEquals(BigDecimal.valueOf(0.80), response.probabilidade());
        assertEquals(summary, response.resumoGastos());
        assertEquals(List.of("Continue mantendo seus gastos controlados."), response.recomendacoes());

        ArgumentCaptor<FinancialAnalysis> analysisCaptor =
                ArgumentCaptor.forClass(FinancialAnalysis.class);

        verify(financialAnalysisRepository).save(analysisCaptor.capture());

        FinancialAnalysis savedAnalysis = analysisCaptor.getValue();

        assertEquals(user, savedAnalysis.getUsuario());
        assertEquals(FinancialProfile.SAUDAVEL, savedAnalysis.getPerfilFinanceiro());
        assertEquals(SavingFrequency.ALTA, savedAnalysis.getFrequenciaPoupanca());
        assertEquals(Source.ML, savedAnalysis.getOrigem());
        assertNotNull(savedAnalysis.getDataAnalise());

        verify(financialProfileService, never()).gerarAnaliseFallback(anyList());
    }

    @Test
    void shouldUseFallbackWhenMlIsUnavailable() {
        AppUser user = createUser();
        FinancialAnalysisRequest request = createRequest();

        List<Transaction> transactions = List.of(
                createTransaction("Salário", 3000.00, TransactionType.RECEITA, TransactionCategory.SALARIO),
                createTransaction("Mercado", 500.00, TransactionType.DESPESA, TransactionCategory.ALIMENTACAO),
                createTransaction("Conta de luz", 200.00, TransactionType.DESPESA, TransactionCategory.UTILITARIOS)
        );

        FinancialAnalysisResponse fallbackResponse = new FinancialAnalysisResponse(
                FinancialProfile.EM_OBSERVACAO,
                BigDecimal.valueOf(23.33),
                SavingFrequency.ALTA,
                BigDecimal.ZERO,
                createExpenseSummary(),
                List.of("Análise gerada em modo simplificado — serviço de IA indisponível no momento.")
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(transactionRepository.findByUsuarioAndDataBetween(
                user,
                request.dataInicial(),
                request.dataFinal()
        )).thenReturn(transactions);
        when(mlClient.analyze(any(MlAnalysisRequest.class)))
                .thenThrow(new ExternalServiceException("ML indisponível"));
        when(financialProfileService.gerarAnaliseFallback(transactions)).thenReturn(fallbackResponse);

        FinancialAnalysisResponse response = service.analyze(1L, request);

        assertEquals(FinancialProfile.EM_OBSERVACAO, response.perfilFinanceiro());
        assertBigDecimalEquals(BigDecimal.valueOf(23.33), response.nivelEndividamento());
        assertEquals(SavingFrequency.ALTA, response.frequenciaPoupanca());
        assertBigDecimalEquals(BigDecimal.ZERO, response.probabilidade());

        ArgumentCaptor<FinancialAnalysis> analysisCaptor =
                ArgumentCaptor.forClass(FinancialAnalysis.class);

        verify(financialAnalysisRepository).save(analysisCaptor.capture());

        FinancialAnalysis savedAnalysis = analysisCaptor.getValue();

        assertEquals(user, savedAnalysis.getUsuario());
        assertEquals(FinancialProfile.EM_OBSERVACAO, savedAnalysis.getPerfilFinanceiro());
        assertEquals(SavingFrequency.ALTA, savedAnalysis.getFrequenciaPoupanca());
        assertEquals(Source.FALLBACK, savedAnalysis.getOrigem());
        assertNotNull(savedAnalysis.getDataAnalise());

        verify(financialProfileService).gerarAnaliseFallback(transactions);
    }

    @Test
    void shouldThrowExceptionWhenThereAreNoTransactions() {
        AppUser user = createUser();
        FinancialAnalysisRequest request = createRequest();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(transactionRepository.findByUsuarioAndDataBetween(
                user,
                request.dataInicial(),
                request.dataFinal()
        )).thenReturn(List.of());

        assertThrows(InvalidRequestException.class, () -> service.analyze(1L, request));

        verify(mlClient, never()).analyze(any(MlAnalysisRequest.class));
        verify(financialAnalysisRepository, never()).save(any(FinancialAnalysis.class));
    }

    @Test
    void shouldThrowExceptionWhenThereAreLessThanThreeTransactions() {
        AppUser user = createUser();
        FinancialAnalysisRequest request = createRequest();

        List<Transaction> transactions = List.of(
                createTransaction("Salário", 3000.00, TransactionType.RECEITA, TransactionCategory.SALARIO),
                createTransaction("Mercado", 300.00, TransactionType.DESPESA, TransactionCategory.ALIMENTACAO)
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(transactionRepository.findByUsuarioAndDataBetween(
                user,
                request.dataInicial(),
                request.dataFinal()
        )).thenReturn(transactions);

        assertThrows(BusinessException.class, () -> service.analyze(1L, request));

        verify(mlClient, never()).analyze(any(MlAnalysisRequest.class));
        verify(financialAnalysisRepository, never()).save(any(FinancialAnalysis.class));
    }

    private AppUser createUser() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setNome("Amanda");
        user.setEmail("amanda@email.com");
        user.setSenha("senha-criptografada");
        user.setAtivo(true);
        return user;
    }

    private FinancialAnalysisRequest createRequest() {
        return new FinancialAnalysisRequest(
                LocalDate.of(2026, 8, 1),
                LocalDate.of(2026, 8, 12)
        );
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
        transaction.setData(LocalDate.of(2026, 8, 5));
        return transaction;
    }

    private ExpenseSummaryResponse createExpenseSummary() {
        return new ExpenseSummaryResponse(
                BigDecimal.valueOf(300.00),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.valueOf(50.00),
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
    }

    private void assertBigDecimalEquals(BigDecimal expected, BigDecimal actual) {
        assertEquals(0, expected.compareTo(actual));
    }
}
