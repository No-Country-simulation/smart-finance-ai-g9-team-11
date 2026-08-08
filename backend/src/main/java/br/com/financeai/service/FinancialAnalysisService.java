package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisHistoryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.Source;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import br.com.financeai.exception.BusinessException;
import br.com.financeai.exception.ExternalServiceException;
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
import lombok.extern.slf4j.Slf4j;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Responsável por gerar e gerenciar as análises financeiras dos usuários.
 * <p>
 * Fluxo de geração:
 * <p>
 * 1. Localiza o usuário autenticado.
 * <p>
 * 2. Busca as transações do usuário dentro do período informado.
 * <p>
 * 3. Monta a requisição para a API de Machine Learning.
 * <p>
 * 4. Recebe o resultado da análise — ou, se a IA estiver indisponível,
 *    gera o resultado localmente via {@link FinancialProfileService}.
 * <p>
 * 5. Persiste o resultado no banco, diferenciado pelo campo {@code origem}
 *    ({@link br.com.financeai.enums.Source#ML} ou {@link br.com.financeai.enums.Source#FALLBACK}).
 * <p>
 * 6. Devolve o resultado ao frontend.
 */
@Slf4j
@Service
public class FinancialAnalysisService {

    private final FinancialProfileService financialProfileService;
    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;

    public FinancialAnalysisService(
            FinancialProfileService financialProfileService, MlClient mlClient,
            FinancialAnalysisRepository financialAnalysisRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.financialProfileService = financialProfileService;
        this.mlClient = mlClient;
        this.financialAnalysisRepository = financialAnalysisRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Gera uma análise financeira baseada no histórico de transações do período informado.
     Tanto o resultado vindo da IA quanto o resultado do fallback local são
     * persistidos no banco, diferenciados pelo campo {@code origem}
     * ({@link Source#ML} ou {@link Source#FALLBACK}).
     *
     * @param usuarioId identificador único do usuário autenticado.
     * @param request dados contendo o período (data inicial e data final) para o qual a análise será gerada.
     * @return resposta contendo o perfil financeiro, resumo dos gastos, frequência de poupança,
     *         nível de endividamento e recomendações geradas — via IA ou via fallback local.
     * @throws BusinessException caso o período informado seja no futuro ou não haja o mínimo de transações exigido (3).
     * @throws InvalidRequestException caso o usuário não possua nenhuma transação no período informado.
     * @throws UserNotFoundException caso o usuário não seja encontrado no banco de dados.
     */
    public FinancialAnalysisResponse analyze(Long usuarioId, FinancialAnalysisRequest request) {

        AppUser user = findUserById(usuarioId);

        // Impede análise de um período que ainda não começou — valida antes
        // de consultar o banco, evitando uma query desnecessária.
        if (request.dataInicial().isAfter(LocalDate.now())) {
            throw new BusinessException(
                    "Não é possível gerar análise para um período que ainda não começou."
            );
        }

        List<Transaction> transactions = buscarTransacoes(user, request);
        MlRequest mlRequest = new MlRequest(mapToMlTransactions(transactions));

        MlResponse mlResponse;
        try {
            mlResponse = mlClient.analyze(mlRequest);

        } catch (ExternalServiceException ex) {

            log.warn("IA indisponível. Análise feita utilizando fallback local para o usuário {}",
                    user.getId(), ex);

            FinancialAnalysisResponse fallback = financialProfileService.gerarAnaliseFallback(transactions);
            financialAnalysisRepository.save(
                    criarAnalise(
                            user,
                            fallback.perfilFinanceiro(),
                            fallback.nivelEndividamento(),
                            fallback.frequenciaPoupanca(),
                            fallback.probabilidade(),
                            Source.FALLBACK
                    )
            );

            return fallback;
        }

        // Monta a entidade FinancialAnalysis com o resultado devolvido pela IA
        // e persiste no banco — isso cria um "retrato" daquela análise, sem guardar
        // vínculo direto com as transações que a originaram.
        financialAnalysisRepository.save(
                criarAnalise(
                        user,
                        mlResponse.perfilFinanceiro(),
                        mlResponse.nivelEndividamento(),
                        mlResponse.frequenciaPoupanca(),
                        mlResponse.probabilidade(),
                        Source.ML
                )
        );

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
     * Busca o usuário pelo ID, lançando erro claro se ele não existir.
     */
    private AppUser findUserById(Long usuarioId) {
        return userRepository.findById(usuarioId)
                .orElseThrow(() -> new UserNotFoundException(
                        "Usuário não encontrado com o ID: " + usuarioId
                ));
    }

    /**
     * Converte as entidades Transaction para o formato esperado pela ML.
     */
    private List<MlTransactionResponse> mapToMlTransactions(List<Transaction> transactions) {
        return transactions.stream()
                .map(transaction -> new MlTransactionResponse(
                        transaction.getDescricao(),
                        transaction.getValor(),
                        transaction.getTipo(),
                        transaction.getCategoria(),
                        transaction.getData()
                ))
                .toList();
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

    private List<Transaction> buscarTransacoes(
            AppUser usuario,
            FinancialAnalysisRequest request
    ) {

        List<Transaction> transactions =
                transactionRepository.findByUsuarioAndDataBetween(
                        usuario,
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

        return transactions;
    }

    private FinancialAnalysis criarAnalise(
            AppUser usuario,
            FinancialProfile perfil,
            BigDecimal nivelEndividamento,
            SavingFrequency frequenciaPoupanca,
            BigDecimal probabilidade,
            Source origem
    ) {

        FinancialAnalysis analysis = new FinancialAnalysis();

        analysis.setUsuario(usuario);
        analysis.setPerfilFinanceiro(perfil);
        analysis.setNivelEndividamento(nivelEndividamento);
        analysis.setFrequenciaPoupanca(frequenciaPoupanca);
        analysis.setProbabilidade(probabilidade);
        analysis.setDataAnalise(LocalDate.now());
        analysis.setOrigem(origem);

        return analysis;
    }
}