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

import java.time.LocalDate;
import java.util.List;

/**
 * Responsável por gerar a análise financeira de um usuário para um período informado.

 * Fluxo geral:
 *   1. Localiza o usuário
 *   2. Busca as transações do usuário dentro do período informado
 *   3. Monta a requisição para a IA (MlRequest) com essas transações
 *   4. Chama a IA e recebe o resultado (perfil financeiro, probabilidade, resumo de gastos, etc.)
 *   5. Persiste o resultado da análise no banco
 *   6. Devolve o resultado formatado para o frontend
 */
@Service
public class FinancialAnalysisService {

    // E-mail fixo do usuário de teste, usado enquanto não existe autenticação real.
    // Quando o JWT for implementado, essa constante deixa de ser necessária.
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

    /**
     * Gera e persiste uma análise financeira para o período informado no request.
     *
     * @param request contém apenas o período (dataInicial/dataFinal) — não recebe transações
     * @return o resultado da análise, no formato que o frontend espera
     */
    public FinancialAnalysisResponse analyze(FinancialAnalysisRequest request) {

        // Passo 1: identifica o usuário dono das transações a serem analisadas
        AppUser user = getTestUser();

        // Passo 2: busca no banco as transações do usuário dentro do período pedido.
        // Essas transações já foram cadastradas e classificadas anteriormente
        // (via TransactionService) — aqui só lemos o que já existe.
        List<Transaction> transactions = transactionRepository
                .findByUsuarioAndDataBetween(user, request.dataInicial(), request.dataFinal());

        // Sem transações no período, não há o que analisar — melhor falhar
        // de forma clara do que mandar uma lista vazia para a IA.
        if (transactions.isEmpty()) {
            throw new InvalidRequestException("Não há transações no período informado.");
        }

        // Passo 3: converte as entidades do banco para o formato que a IA espera.
        // Monta a lista que a IA precisa, a partir do que já está no banco
        List<MlTransactionRequest> mlTransactions = transactions.stream()
                .map(t -> new MlTransactionRequest(t.getDescricao(), t.getValor(), t.getTipo(), t.getData()))
                .toList();

        // Passo 4: chama a IA passando todas as transações do período de uma vez,
        // e recebe de volta o resultado da análise (perfil, probabilidade, etc.)
        MlRequest mlRequest = new MlRequest(mlTransactions);
        MlResponse mlResponse = mlClient.analyze(mlRequest);

        // Busca o usuário novamente só para validar que ele ainda existe
        // antes de vincular a análise a ele.
        AppUser appUser = userRepository
                .findByEmail(TEST_USER_EMAIL)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário de teste não encontrado."
                        )
                );

        // Passo 5: monta a entidade FinancialAnalysis com o resultado devolvido pela IA
        // e persiste no banco — isso cria um "retrato" daquela análise, sem guardar
        // vínculo direto com as transações que a originaram.
        FinancialAnalysis analysis = new FinancialAnalysis();
        analysis.setUsuario(user);
        analysis.setPerfilFinanceiro(mlResponse.perfilFinanceiro());
        analysis.setFrequenciaPoupanca(mlResponse.frequenciaPoupanca());
        analysis.setNivelEndividamento(mlResponse.nivelEndividamento());
        analysis.setProbabilidade(mlResponse.probabilidade());
        analysis.setDataAnalise(LocalDate.now());

        financialAnalysisRepository.save(analysis);

        // Passo 6: devolve o resultado da análise já no formato de resposta da API,
        // usando os mesmos dados que acabamos de persistir.
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
     * Busca o usuário de teste fixo no banco.
     *
     * Substituído futuramente pela identificação do usuário autenticado (JWT).
     */
    private AppUser getTestUser() {

        return userRepository.findByEmail(TEST_USER_EMAIL)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário de teste não encontrado."
                        ));
    }
}