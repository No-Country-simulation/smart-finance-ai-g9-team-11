package br.com.financeai.service;

import br.com.financeai.dto.request.CreateTransactionRequest;
import br.com.financeai.dto.request.UpdateTransactionRequest;
import br.com.financeai.dto.response.TransactionResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
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
        AppUser usuario = findUserById(usuarioId);

        List<Transaction> transactions = requests.stream()
                .map(request -> buildTransaction(
                        request.descricao(),
                        request.valor(),
                        request.tipo(),
                        request.dataTransacao(),
                        usuario
                ))
                .toList();

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
                .findAllByUsuarioIdOrderByDataTransacaoDescIdDesc(usuarioId)
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
        validatePeriod(dataInicial, dataFinal);

        return transactionRepository
                .findAllByUsuarioIdAndDataTransacaoBetweenOrderByDataTransacaoDescIdDesc(
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
    public TransactionResponse findById(
            Long usuarioId,
            Long transactionId
    ) {
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
    public TransactionResponse update(
            Long usuarioId,
            Long transactionId,
            UpdateTransactionRequest request
    ) {
        Transaction transaction =
                findTransactionByIdAndUserId(transactionId, usuarioId);

        TransactionCategory categoria = classify(
                request.descricao(),
                request.valor(),
                request.tipo(),
                request.dataTransacao()
        );

        transaction.setDescricao(request.descricao().trim());
        transaction.setValor(request.valor());
        transaction.setTipo(request.tipo());
        transaction.setCategoria(categoria);
        transaction.setDataTransacao(request.dataTransacao());

        Transaction updatedTransaction =
                transactionRepository.save(transaction);

        return toResponse(updatedTransaction);
    }

    /**
     * Exclui uma transação somente quando ela pertence ao usuário.
     */
    @Transactional
    public void delete(
            Long usuarioId,
            Long transactionId
    ) {
        Transaction transaction =
                findTransactionByIdAndUserId(transactionId, usuarioId);

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
        TransactionCategory categoria = classify(descricao, valor, tipo, dataTransacao);

        Transaction transaction = new Transaction();
        transaction.setDescricao(descricao.trim());
        transaction.setValor(valor);
        transaction.setTipo(tipo);
        transaction.setCategoria(categoria);
        transaction.setDataTransacao(dataTransacao);
        transaction.setUsuario(usuario);

        return transaction;
    }

    /**
     * Chama o MlClient para obter a categoria da transação.
     */
    private TransactionCategory classify(
            String descricao,
            BigDecimal valor,
            TransactionType tipo,
            LocalDate dataTransacao
    ) {
        MlTransactionRequest mlRequest =
                new MlTransactionRequest(descricao, valor, tipo, dataTransacao);

        MlTransactionResponse mlResponse =
                mlClient.classifyTransaction(mlRequest);

        return mlResponse.categoria();
    }

    private AppUser findUserById(Long usuarioId) {
        return userRepository
                .findById(usuarioId)
                .orElseThrow(() -> new UserNotFoundException(
                        "Usuário não encontrado com o ID: " + usuarioId
                ));
    }

    private Transaction findTransactionByIdAndUserId(
            Long transactionId,
            Long usuarioId
    ) {
        return transactionRepository
                .findByIdAndUsuarioId(transactionId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transação não encontrada para o usuário informado."
                ));
    }

    private void validatePeriod(
            LocalDate dataInicial,
            LocalDate dataFinal
    ) {
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

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescricao(),
                transaction.getValor(),
                transaction.getTipo(),
                transaction.getCategoria(),
                transaction.getDataTransacao(),
                transaction.getUsuario().getId()
        );
    }
}