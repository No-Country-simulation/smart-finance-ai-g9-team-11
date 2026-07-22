package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.dto.response.TransactionClassificationResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.entity.Transaction;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.repository.FinancialAnalysisRepository;
import br.com.financeai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FinancialAnalysisService {

    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;
    private final TransactionClassificationService transactionClassificationService;


    public FinancialAnalysisService(MlClient mlClient, FinancialAnalysisRepository financialAnalysisRepository, UserRepository userRepository, TransactionClassificationService transactionClassificationService) {
        this.mlClient = mlClient;
        this.financialAnalysisRepository = financialAnalysisRepository;
        this.userRepository = userRepository;
        this.transactionClassificationService = transactionClassificationService;
    }

    public FinancialAnalysisResponse analyze(FinancialAnalysisRequest analysisRequest) {
        if (analysisRequest.transacoes().isEmpty()) {
            throw new InvalidRequestException("A lista de transações não pode estar vazia");
        }

        if (analysisRequest.rendaMensal().compareTo(BigDecimal.ZERO) == 0 &&
                analysisRequest.transacoes().size() > 10) {
            throw new InvalidRequestException("Informação financeira inválida.");
        }


        
        // 1. Criamos o seu MlRequest pegando os dados limpos que vieram do controller
        MlRequest mlRequest = new MlRequest(
                analysisRequest.rendaMensal(),
                analysisRequest.nivelEndividamento(),
                analysisRequest.frequenciaPoupanca(),
                analysisRequest.transacoes()
        );

        // 2. Agora passamos o mlRequest (que o client espera receber)
        MlResponse mlResponse = mlClient.analyze(mlRequest);

        FinancialAnalysis analysis = new FinancialAnalysis();

        //Persistindo análise financeira
        AppUser appUser = userRepository.findByEmail("teste@financeai.com").orElseThrow(() ->
                new UserNotFoundException("Usuário de teste não encontrado."));

        //Persistência entrada de dados do usuário
        analysis.setUsuario(appUser);
        analysis.setRendaMensal(analysisRequest.rendaMensal());
        analysis.setNivelEndividamento(analysisRequest.nivelEndividamento());
        analysis.setFrequenciaPoupanca(analysisRequest.frequenciaPoupanca());
        analysis.setDataAnalise(LocalDateTime.now());

        //persistência reposta da API
        analysis.setPerfilFinanceiro(mlResponse.perfilFinanceiro());
        analysis.setProbabilidade(mlResponse.probabilidade());

        //persistência das transações
        analysisRequest.transacoes().forEach(transactionRequest -> {

            TransactionClassificationResponse classified = transactionClassificationService.classify(transactionRequest);

            Transaction transaction = new Transaction();

            transaction.setDescricao(classified.descricao());
            transaction.setValor(classified.valor());
            transaction.setCategoria(classified.categoria());
            transaction.setAnalise(analysis);

            analysis.addTransaction(transaction);
        });

        financialAnalysisRepository.save(analysis);

        return new FinancialAnalysisResponse(
                mlResponse.perfilFinanceiro(),
                mlResponse.probabilidade(),
                mlResponse.resumoGastos(),
                mlResponse.recomendacoes()
        );

    }

}
