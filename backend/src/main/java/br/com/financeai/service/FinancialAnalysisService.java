package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.entity.Transaction;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.repository.FinancialAnalysisRepository;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinancialAnalysisService {

    private static final String TEST_USER_EMAIL = "teste@financeai.com";

    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;


    public FinancialAnalysisService(MlClient mlClient, FinancialAnalysisRepository financialAnalysisRepository, TransactionRepository transactionRepository, UserRepository userRepository) {
        this.mlClient = mlClient;
        this.financialAnalysisRepository = financialAnalysisRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public FinancialAnalysisResponse analyze(FinancialAnalysisRequest request) {

        AppUser user = getTestUser();

        List<Transaction> transactions = transactionRepository
                .findByUsuarioAndDataTransacaoBetween(user, request.dataInicial(), request.dataFinal());

        if (transactions.isEmpty()) {
            throw new InvalidRequestException("Não há transações no período informado.");
        }

        // Monta a lista que a IA precisa, a partir do que já está no banco
        List<MlTransactionRequest> mlTransactions = transactions.stream()
                .map(t -> new MlTransactionRequest(t.getDescricao(), t.getValor(), t.getTipo(), t.getDataTransacao()))
                .toList();

        MlRequest mlRequest = new MlRequest(mlTransactions);
        MlResponse mlResponse = mlClient.analyze(mlRequest);

        AppUser appUser = userRepository
                .findByEmail(TEST_USER_EMAIL)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário de teste não encontrado."
                        )
                );

        FinancialAnalysis analysis = new FinancialAnalysis();
        analysis.setUsuario(user);
        analysis.setPerfilFinanceiro(mlResponse.financialProfile());
        analysis.setFrequenciaPoupanca(mlResponse.frequenciaPoupanca());
        analysis.setNivelEndividamento(mlResponse.nivelEndividamento());
        analysis.setProbabilidade(mlResponse.probabilidade());
        analysis.setDataAnalise(LocalDate.now());

        financialAnalysisRepository.save(analysis);

        return new FinancialAnalysisResponse(
                mlResponse.financialProfile(),
                mlResponse.probabilidade(),
                mlResponse.resumoGastos(),
                mlResponse.recommendations()
        );
    }

    private AppUser getTestUser() {

        return userRepository.findByEmail(TEST_USER_EMAIL)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário de teste não encontrado."
                        ));
    }
}