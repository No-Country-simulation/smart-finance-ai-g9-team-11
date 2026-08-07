package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisHistoryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.entity.Transaction;
import br.com.financeai.exception.BusinessException;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.exception.ResourceNotFoundException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import br.com.financeai.repository.FinancialAnalysisRepository;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Responsável por gerar e gerenciar as análises financeiras dos usuários.
 *
 * Fluxo de geração:
 * 1. Localiza o usuário autenticado.
 * 2. Busca as transações do usuário dentro do período informado.
 * 3. Monta a requisição para a API de Machine Learning.
 * 4. Recebe o resultado da análise.
 * 5. Persiste o resultado no banco.
 * 6. Devolve o resultado ao frontend.
 */
@Service
public class FinancialAnalysisService {

    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;

    public FinancialAnalysisService(
            MlClient mlClient,
            FinancialAnalysisRepository financialAnalysisRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.mlClient = mlClient;
        this.financialAnalysisRepository = financialAnalysisRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Gera e persiste uma análise financeira para o usuário autenticado
     * dentro do período informado.
     *
     * @param usuarioId identificador do usuário autenticado
     * @param request contém o período da análise
     * @return resultado da análise financeira
     */
    @Transactional
    public FinancialAnalysisResponse analyze(
            Long usuarioId,
            FinancialAnalysisRequest request
    ) {
        // Localiza o usuário autenticado no banco.
        AppUser user = userRepository
                .findById(usuarioId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário autenticado não encontrado."
                        ));

        // Impede análise de um período que ainda não começou.
        if (request.dataInicial().isAfter(LocalDate.now())) {
            throw new BusinessException(
                    "Não é possível gerar análise para um período que ainda não começou."
            );
        }

        // Busca somente as transações pertencentes ao usuário autenticado
        // e que estejam dentro do período solicitado.
        List<Transaction> transactions = transactionRepository
                .findByUsuarioAndDataBetween(
                        user,
                        request.dataInicial(),
                        request.dataFinal()
                );

        if (transactions.isEmpty()) {
            throw new InvalidRequestException(
                    "Não há transações no período informado."
            );
        }

        if (transactions.size() < 3) {
            throw new BusinessException(
                    "É necessário ter pelo menos 3 transações no período para gerar uma análise confiável."
            );
        }

        // Converte as entidades Transaction para o formato esperado pela ML.
        List<MlTransactionResponse> mlTransactions = transactions.stream()
                .map(transaction -> new MlTransactionResponse(
                        transaction.getDescricao(),
                        transaction.getValor(),
                        transaction.getTipo(),
                        transaction.getCategoria(),
                        transaction.getData()
                ))
                .toList();

        // Envia as transações para o serviço de Machine Learning.
        MlRequest mlRequest = new MlRequest(mlTransactions);
        MlResponse mlResponse = mlClient.analyze(mlRequest);

        // Monta a entidade que será armazenada no banco.
        FinancialAnalysis analysis = new FinancialAnalysis();
        analysis.setUsuario(user);
        analysis.setPerfilFinanceiro(mlResponse.perfilFinanceiro());
        analysis.setFrequenciaPoupanca(mlResponse.frequenciaPoupanca());
        analysis.setNivelEndividamento(mlResponse.nivelEndividamento());
        analysis.setProbabilidade(mlResponse.probabilidade());
        analysis.setDataAnalise(LocalDate.now());

        financialAnalysisRepository.save(analysis);

        return new FinancialAnalysisResponse(
                mlResponse.perfilFinanceiro(),
                mlResponse.nivelEndividamento(),
                mlResponse.frequenciaPoupanca(),
                mlResponse.probabilidade(),
                mlResponse.resumoGastos(),
                mlResponse.recomendacoes()
        );
    }

    /**
     * Lista todas as análises financeiras do usuário,
     * ordenadas da mais recente para a mais antiga.
     */
    public List<FinancialAnalysisHistoryResponse> findAll(Long usuarioId) {
        return financialAnalysisRepository
                .findAllByUsuarioIdOrderByDataAnaliseDescIdDesc(usuarioId)
                .stream()
                .map(FinancialAnalysisHistoryResponse::new)
                .toList();
    }

    /**
     * Busca uma análise pelo ID, desde que pertença ao usuário.
     */
    public FinancialAnalysisHistoryResponse findById(
            Long usuarioId,
            Long analysisId
    ) {
        FinancialAnalysis analysis =
                findAnalysisByIdAndUserId(
                        analysisId,
                        usuarioId
                );

        return new FinancialAnalysisHistoryResponse(analysis);
    }

    /**
     * Exclui uma análise somente quando ela pertence ao usuário.
     */
    @Transactional
    public void delete(
            Long usuarioId,
            Long analysisId
    ) {
        FinancialAnalysis analysis =
                findAnalysisByIdAndUserId(
                        analysisId,
                        usuarioId
                );

        financialAnalysisRepository.delete(analysis);
    }

    /**
     * Busca uma análise validando que ela pertence ao usuário autenticado.
     *
     * Se a análise existir, mas pertencer a outro usuário, também será
     * considerada não encontrada. Isso impede exposição de dados de terceiros.
     */
    private FinancialAnalysis findAnalysisByIdAndUserId(
            Long analysisId,
            Long usuarioId
    ) {
        return financialAnalysisRepository
                .findByIdAndUsuarioId(
                        analysisId,
                        usuarioId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Análise financeira não encontrada."
                        ));
    }
}