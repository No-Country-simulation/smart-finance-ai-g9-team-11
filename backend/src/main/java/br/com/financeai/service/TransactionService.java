package br.com.financeai.service;

import br.com.financeai.dto.request.CreateTransactionRequest;
import br.com.financeai.dto.request.UpdateTransactionRequest;
import br.com.financeai.dto.response.TransactionResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.Source;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import br.com.financeai.exception.*;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Responsável pelo CRUD completo de transações: criar (uma ou em lote),
 * listar, buscar por id, atualizar e excluir.
 *
 * Toda transação criada ou editada passa pela IA (MlClient) para receber
 * uma categoria — o usuário nunca informa a categoria manualmente.
 *
 * O usuário é identificado pelo header X-User-Id (placeholder provisório,
 * até existir autenticação real via JWT), e toda operação valida que a
 * transação pertence de fato ao usuário informado, evitando que alguém
 * acesse/edite/exclua dados de outra pessoa só adivinhando um ID.
 */
@Slf4j
@Service
public class TransactionService {

    private final TransactionClassificationService transactionClassificationService;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;

    public TransactionService(
            TransactionClassificationService transactionClassificationService,
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            MlClient mlClient
    ) {
        this.transactionClassificationService = transactionClassificationService;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.mlClient = mlClient;
    }

    /**
     * Cria e processa uma única transação para o usuário informado, enviando-a para classificação automática.
     *
     * @param usuarioId identificador único do usuário dono da transação.
     * @param request dados da transação que será criada (valor, descrição, data e tipo).
     * @return resposta contendo os dados da transação salva no banco, incluindo a categoria definida pela IA.
     * @throws UserNotFoundException caso o usuário informado não exista.
     * @throws BusinessException caso já exista uma transação idêntica cadastrada na mesma data.
     */
    @Transactional
    public TransactionResponse create(Long usuarioId, CreateTransactionRequest request) {
        return createBatch(usuarioId, List.of(request)).get(0);
    }

    /**
     * Cria e processa um lote de transações de uma única vez para o usuário informado.
     *
     * @param usuarioId identificador único do usuário dono das transações.
     * @param requests lista contendo os dados das transações que serão criadas.
     * @return lista com as respostas de todas as transações persistidas e classificadas com sucesso.
     * @throws UserNotFoundException caso o usuário informado não exista.
     * @throws BusinessException caso exista alguma transação idêntica cadastrada na mesma data no lote.
     */
    @Transactional
    public List<TransactionResponse> createBatch(
            Long usuarioId,
            List<CreateTransactionRequest> requests
    ) {
        // Garante que o usuário existe antes de processar qualquer transação
        AppUser usuario = findUserById(usuarioId);

        for (CreateTransactionRequest request : requests) {
            boolean exists = transactionRepository.existsByUsuarioAndDescricaoAndValorAndData(
                    usuario, request.descricao(), request.valor(), request.data()
            );
            if (exists) {
                throw new BusinessException(
                        "Já existe uma transação idêntica cadastrada para esta data."
                );
            }
        }

        // Para cada transação recebida: classifica (chama a IA) e monta a entidade
        // pronta para ser salva. O mapeamento acontece uma transação por vez.
        List<Transaction> transactions = requests.stream()
                .map(request -> buildTransaction(
                        request.descricao(),
                        request.valor(),
                        request.tipo(),
                        request.data(),
                        usuario
                ))
                .toList();

        // Persiste todas de uma vez (uma única operação no banco, mesmo que
        // sejam várias transações), e converte cada entidade salva de volta
        // para o formato de resposta da API.
        return transactionRepository.saveAll(transactions)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Atualiza os dados editáveis de uma transação e recalcula sua categoria com base nos novos valores.
     *
     * @param usuarioId identificador único do usuário dono da transação.
     * @param transactionId identificador único da transação que será atualizada.
     * @param request dados atualizados da transação.
     * @return resposta contendo os dados da transação após a edição e nova classificação.
     * @throws ResourceNotFoundException caso a transação não exista ou não pertença ao usuário.
     * @throws BusinessException caso a transação possua mais de 30 dias (fora da janela de edição permitida).
     */
    @Transactional
    public TransactionResponse update(Long usuarioId, Long transactionId, UpdateTransactionRequest request) {
        // Só busca a transação se ela realmente pertencer a esse usuário
        Transaction transaction = findTransactionByIdAndUserId(transactionId, usuarioId);

        validateEditableWindow(transaction);

        // Atualiza os dados básicos
        transaction.setDescricao(request.descricao().trim());
        transaction.setValor(request.valor());
        transaction.setTipo(request.tipo());
        transaction.setData(request.data());

        // Recalcula a categoria e seta a origem internamente na própria entidade
        classifyAndSetOrigin(
                transaction,
                request.descricao(),
                request.valor(),
                request.tipo(),
                request.data()
        );

        Transaction updatedTransaction = transactionRepository.save(transaction);

        return toResponse(updatedTransaction);
    }

    /**
     * Remove permanentemente uma transação do sistema, validando a posse pelo usuário.
     *
     * @param usuarioId identificador único do usuário dono da transação.
     * @param transactionId identificador único da transação que será excluída.
     * @throws ResourceNotFoundException caso a transação não exista ou não pertença ao usuário.
     * @throws BusinessException caso a transação possua mais de 30 dias (fora da janela de exclusão permitida).
     */
    @Transactional
    public void delete(Long usuarioId, Long transactionId) {
        // Reaproveita a mesma validação de posse usada em findById/update —
        // se a transação não for do usuário, lança ResourceNotFoundException.
        Transaction transaction = findTransactionByIdAndUserId(transactionId, usuarioId);

        validateEditableWindow(transaction);

        transactionRepository.delete(transaction);
    }

    /**
     * Recupera todo o histórico de transações cadastradas para o usuário informado.
     *
     * @param usuarioId identificador único do usuário.
     * @return lista de transações ordenadas da mais recente para a mais antiga.
     * @throws UserNotFoundException caso o usuário informado não exista.
     */
    public List<TransactionResponse> findAll(Long usuarioId) {
        findUserById(usuarioId);

        return transactionRepository
                .findAllByUsuarioIdOrderByDataDescIdDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Recupera o histórico de transações do usuário filtrado por um intervalo de datas.
     *
     * @param usuarioId identificador único do usuário.
     * @param dataInicial data de início para a filtragem.
     * @param dataFinal data de término para a filtragem.
     * @return lista de transações encontradas dentro do período, ordenadas por data decrescente.
     * @throws UserNotFoundException caso o usuário informado não exista.
     * @throws InvalidRequestException caso alguma das datas seja nula ou a data inicial seja posterior à final.
     */
    public List<TransactionResponse> findAllByPeriod(
            Long usuarioId,
            LocalDate dataInicial,
            LocalDate dataFinal
    ) {
        findUserById(usuarioId);
        // Garante que as duas datas foram informadas e que fazem sentido
        // (dataInicial não pode vir depois de dataFinal) antes de consultar.
        validatePeriod(dataInicial, dataFinal);

        return transactionRepository
                .findAllByUsuarioIdAndDataBetweenOrderByDataDescIdDesc(
                        usuarioId,
                        dataInicial,
                        dataFinal
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Busca os detalhes de uma transação específica, validando a posse pelo usuário.
     *
     * @param usuarioId identificador único do usuário.
     * @param transactionId identificador único da transação desejada.
     * @return resposta contendo os dados completos da transação encontrada.
     * @throws ResourceNotFoundException caso a transação não exista ou não pertença ao usuário informado.
     */
    public TransactionResponse findById(Long usuarioId, Long transactionId) {
        // findTransactionByIdAndUserId já garante a posse do recurso:
        // se a transação existir mas for de outro usuário, é tratada
        // como "não encontrada" (não vaza a existência do dado de terceiros).
        Transaction transaction = findTransactionByIdAndUserId(transactionId, usuarioId);

        return toResponse(transaction);
    }

    /**
     * Constrói a entidade de transação pronta para persistência, realizando a
     * classificação automática da categoria via integração com a IA ou fallback.
     *
     * @param descricao descrição detalhada da transação.
     * @param valor montante financeiro da transação.
     * @param tipo indica se a transação é uma RECEITA ou DESPESA.
     * @param dataTransacao data em que a transação ocorreu.
     * @param usuario entidade do usuário dono da transação.
     * @return a entidade {@link Transaction} montada e classificada.
     */
    private Transaction buildTransaction(
            String descricao,
            BigDecimal valor,
            TransactionType tipo,
            LocalDate dataTransacao,
            AppUser usuario
    ) {
        Transaction transaction = new Transaction();
        transaction.setDescricao(descricao.trim());
        transaction.setValor(valor);
        transaction.setTipo(tipo);
        transaction.setData(dataTransacao);
        transaction.setUsuario(usuario);

        // Aplica a classificação e define a origem direto na entidade
        classifyAndSetOrigin(transaction, descricao, valor, tipo, dataTransacao);

        return transaction;
    }

    /**
     * Comunica-se com o serviço de Machine Learning para obter a categoria da transação.
     * Em caso de falha de comunicação, aciona automaticamente o mecanismo de fallback local.
     * Altera a própria entidade Transaction, definindo a categoria e a origem.
     *
     * @param transaction a entidade que será atualizada com a categoria e origem.
     * @param descricao descrição da transação.
     * @param valor montante financeiro da transação.
     * @param tipo indica se a transação é uma RECEITA ou DESPESA.
     * @param dataTransacao data em que a transação ocorreu.
     */
    private void classifyAndSetOrigin(
            Transaction transaction,
            String descricao,
            BigDecimal valor,
            TransactionType tipo,
            LocalDate dataTransacao
    ) {
        MlTransactionRequest mlRequest = new MlTransactionRequest(descricao, valor, tipo, dataTransacao);

        try {
            MlTransactionResponse mlResponse = mlClient.classifyTransaction(mlRequest);

            transaction.setCategoria(mlResponse.categoria());
            transaction.setOrigem(Source.ML);

        } catch (ExternalServiceException ex) {

            log.warn("IA indisponível. Classificação realizada utilizando fallback.");

            MlTransactionResponse fallbackResponse = transactionClassificationService.classifyTransactionFallback(mlRequest);

            transaction.setCategoria(fallbackResponse.categoria());
            transaction.setOrigem(Source.FALLBACK);
        }
    }

    /**
     * Recupera um usuário no banco de dados através do seu identificador único.
     *
     * @param usuarioId identificador único do usuário.
     * @return a entidade {@link AppUser} correspondente.
     * @throws UserNotFoundException caso não exista usuário com o ID fornecido.
     */
    private AppUser findUserById(Long usuarioId) {
        return userRepository
                .findById(usuarioId)
                .orElseThrow(() -> new UserNotFoundException(
                        "Usuário não encontrado com o ID: " + usuarioId
                ));
    }

    /**
     * Busca uma transação no banco de dados garantindo que ela pertença ao usuário especificado.
     * Essa validação conjunta evita acessos indevidos a dados de terceiros.
     *
     * @param transactionId identificador único da transação.
     * @param usuarioId identificador único do usuário que está solicitando o recurso.
     * @return a entidade {@link Transaction} encontrada.
     * @throws ResourceNotFoundException caso a transação não exista ou pertença a outro usuário.
     */
    private Transaction findTransactionByIdAndUserId(Long transactionId, Long usuarioId) {
        return transactionRepository
                .findByIdAndUsuarioId(transactionId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transação não encontrada para o usuário informado."
                ));
    }

    /**
     * Valida a consistência de um intervalo de datas fornecido para operações de filtro.
     *
     * @param dataInicial data de início do intervalo.
     * @param dataFinal data de término do intervalo.
     * @throws InvalidRequestException caso alguma data seja nula ou a data inicial seja posterior à final.
     */
    private void validatePeriod(LocalDate dataInicial, LocalDate dataFinal) {
        if (dataInicial == null || dataFinal == null) {
            throw new InvalidRequestException(
                    "A data inicial e a data final são obrigatórias para o filtro."
            );
        }

        if (dataInicial.isAfter(dataFinal)) {
            throw new InvalidRequestException(
                    "A data inicial não pode ser posterior à data final."
            );
        }
    }

    /**
     * Converte uma entidade de transação do banco de dados para o objeto de transferência
     * de dados (DTO) utilizado nas respostas da API. A origem é omitida para uso exclusivo interno.
     *
     * @param transaction a entidade {@link Transaction} que será convertida.
     * @return o DTO {@link TransactionResponse} formatado para o frontend.
     */
    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescricao(),
                transaction.getValor(),
                transaction.getTipo(),
                transaction.getCategoria(),
                transaction.getData(),
                transaction.getUsuario().getId()
        );
    }

    /**
     * Valida se uma transação está dentro da janela de tempo permitida para edições ou exclusões.
     *
     * @param transaction a entidade da transação a ser validada.
     * @throws BusinessException caso a transação possua uma data anterior aos últimos 30 dias.
     */
    private void validateEditableWindow(Transaction transaction) {
        if (transaction.getData().isBefore(LocalDate.now().minusDays(30))) {
            throw new BusinessException(
                    "Não é possível editar ou excluir transações com mais de 30 dias."
            );
        }
    }
}