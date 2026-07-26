package br.com.financeai.service;

import br.com.financeai.dto.request.CreateTransactionRequest;
import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.dto.request.UpdateTransactionRequest;
import br.com.financeai.dto.response.TransactionClassificationResponse;
import br.com.financeai.dto.response.TransactionResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.exception.ResourceNotFoundException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionClassificationService classificationService;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            TransactionClassificationService classificationService
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.classificationService = classificationService;
    }

    /**
     * Cria uma transação para o usuário informado.
     *
     * A categoria é obtida pelo serviço de classificação antes
     * da persistência do registro.
     */
    @Transactional
    public TransactionResponse create(
            Long usuarioId,
            CreateTransactionRequest request
    ) {
        AppUser usuario = findUserById(usuarioId);

        TransactionClassificationResponse classification =
                classify(request.descricao(), request.valor());

        Transaction transaction = new Transaction();
        transaction.setDescricao(request.descricao().trim());
        transaction.setValor(request.valor());
        transaction.setTipo(request.tipo());
        transaction.setCategoria(classification.categoria());
        transaction.setDataTransacao(request.dataTransacao());
        transaction.setUsuario(usuario);

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return toResponse(savedTransaction);
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

        TransactionClassificationResponse classification =
                classify(request.descricao(), request.valor());

        transaction.setDescricao(request.descricao().trim());
        transaction.setValor(request.valor());
        transaction.setTipo(request.tipo());
        transaction.setCategoria(classification.categoria());
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

    private TransactionClassificationResponse classify(
            String descricao,
            java.math.BigDecimal valor
    ) {
        TransactionRequest classificationRequest =
                new TransactionRequest(descricao, valor);

        return classificationService.classify(classificationRequest);
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