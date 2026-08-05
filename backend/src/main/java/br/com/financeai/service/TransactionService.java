package br.com.financeai.service;

import br.com.financeai.dto.request.CreateTransactionRequest;
import br.com.financeai.dto.request.UpdateTransactionRequest;
import br.com.financeai.dto.response.TransactionResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import br.com.financeai.exception.BusinessException;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.exception.ResourceNotFoundException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import jakarta.transaction.Transactional;
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
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            MlClient mlClient
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.mlClient = mlClient;
    }

    /**
     * Cria uma única transação para o usuário informado.
     *
     * Reaproveita o createBatch() internamente, tratando o caso
     * de uma transação só como uma lista de tamanho 1.
     */
    @Transactional
    public TransactionResponse create(Long usuarioId, CreateTransactionRequest request) {

        return createBatch(usuarioId, List.of(request)).get(0);
    }

    /**
     * Cria uma ou várias transações de uma vez para o usuário informado.
     *
     * Cada transação é classificada individualmente antes do saveAll,
     * mantendo a mesma regra de negócio usada na criação única.
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
     * Lista todas as transações do usuário.
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
     * Lista transações dentro de um intervalo de datas.
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
     * Busca uma transação garantindo que ela pertença ao usuário.
     */
    public TransactionResponse findById(Long usuarioId, Long transactionId) {
        // findTransactionByIdAndUserId já garante a posse do recurso:
        // se a transação existir mas for de outro usuário, é tratada
        // como "não encontrada" (não vaza a existência do dado de terceiros).
        Transaction transaction =
                findTransactionByIdAndUserId(transactionId, usuarioId);

        return toResponse(transaction);
    }

    /**
     * Atualiza todos os dados editáveis da transação.
     *
     * A categoria é recalculada porque alterações na descrição
     * ou no valor podem mudar o resultado da classificação.
     */
    @Transactional
    public TransactionResponse update(Long usuarioId, Long transactionId, UpdateTransactionRequest request) {
        // Só busca a transação se ela realmente pertencer a esse usuário
        Transaction transaction = findTransactionByIdAndUserId(transactionId, usuarioId);

        validateEditableWindow(transaction);

        // Recalcula a categoria com os dados novos, já que descrição/valor
        // podem ter mudado o suficiente para mudar a classificação da IA.
        TransactionCategory categoria = classify(
                request.descricao(),
                request.valor(),
                request.tipo(),
                request.data()
        );

        // Aplica os novos valores na entidade já existente (não cria uma nova)
        transaction.setDescricao(request.descricao().trim());
        transaction.setValor(request.valor());
        transaction.setTipo(request.tipo());
        transaction.setCategoria(categoria);
        transaction.setData(request.data());

        Transaction updatedTransaction =
                transactionRepository.save(transaction);

        return toResponse(updatedTransaction);
    }

    /**
     * Exclui uma transação somente quando ela pertence ao usuário.
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
     * Monta a entidade Transaction já classificada, pronta para persistir.
     * Centraliza a lógica usada tanto pelo create() quanto pelo createBatch().
     */
    private Transaction buildTransaction(
            String descricao,
            BigDecimal valor,
            TransactionType tipo,
            LocalDate dataTransacao,
            AppUser usuario
    ) {
        // A categoria nunca é informada pelo usuário — sempre vem da IA
        TransactionCategory categoria = classify(descricao, valor, tipo, dataTransacao);

        Transaction transaction = new Transaction();
        transaction.setDescricao(descricao.trim());
        transaction.setValor(valor);
        transaction.setTipo(tipo);
        transaction.setCategoria(categoria);
        transaction.setData(dataTransacao);
        transaction.setUsuario(usuario);

        return transaction;
    }

    /**
     * Chama o MlClient para obter a categoria da transação.
     *
     * É o único ponto de contato com a IA para classificação — tanto o
     * cadastro (buildTransaction) quanto a edição (update) passam por aqui,
     * garantindo que a regra de "quem classifica é a IA" nunca seja
     * duplicada ou implementada de forma diferente em outro lugar.
     */
    private TransactionCategory classify(
            String descricao,
            BigDecimal valor,
            TransactionType tipo,
            LocalDate dataTransacao
    ) {
        MlTransactionRequest mlRequest = new MlTransactionRequest(descricao, valor, tipo, dataTransacao);

        MlTransactionResponse mlResponse = mlClient.classifyTransaction(mlRequest);

        return mlResponse.categoria();
    }

    /**
     * Busca o usuário pelo ID, lançando erro claro se ele não existir.
     * Usado no início de toda operação que precisa saber "de quem" é a transação.
     */
    private AppUser findUserById(Long usuarioId) {
        return userRepository
                .findById(usuarioId)
                .orElseThrow(() -> new UserNotFoundException(
                        "Usuário não encontrado com o ID: " + usuarioId
                ));
    }

    /**
     * Busca uma transação validando, na própria consulta, que ela pertence
     * ao usuário informado — evita que alguém acesse/edite/exclua uma
     * transação de outro usuário só sabendo o ID dela.
     */
    private Transaction findTransactionByIdAndUserId(Long transactionId, Long usuarioId) {
        return transactionRepository
                .findByIdAndUsuarioId(transactionId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transação não encontrada para o usuário informado."
                ));
    }

    /**
     * Valida que o período informado para o filtro faz sentido:
     * as duas datas precisam estar presentes, e a inicial não pode
     * ser posterior à final.
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
     * Converte a entidade Transaction (formato de banco) para o DTO
     * de resposta da API (formato exposto ao frontend).
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
    // Bloqueia edição de transações fora da janela permitida
    private void validateEditableWindow(Transaction transaction) {
        if (transaction.getData().isBefore(LocalDate.now().minusDays(30))) {
            throw new BusinessException(
                    "Não é possível editar ou excluir transações com mais de 30 dias."
            );
        }
    }
}