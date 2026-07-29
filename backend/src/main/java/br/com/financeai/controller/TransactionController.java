package br.com.financeai.controller;

import br.com.financeai.dto.request.CreateTransactionRequest;
import br.com.financeai.dto.request.UpdateTransactionRequest;
import br.com.financeai.dto.response.TransactionResponse;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @Operation(
            summary = "Classify transaction",
            description = "Receives a financial transaction and returns a mocked expense classification"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Transaction classified seccessfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid transaction data"
    )

    /**
     * Cria uma única transação para o usuário informado.
     *
     * O cabeçalho X-User-Id é provisório e deverá ser substituído
     * pelo usuário autenticado quando o JWT for implementado.
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> create(@RequestHeader("X-User-Id") Long usuarioId, @Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.create(usuarioId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(
            summary = "Classify transaction",
            description = "Receives a list of financial transaction and returns a mocked expense classification"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Transactions classified seccessfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid transaction data"
    )

    /**
     * Cria várias transações de uma vez para o usuário informado.
     *
     * Útil para importação de extratos ou cadastro em lote.
     */
    @PostMapping("/batch")
    public ResponseEntity<List<TransactionResponse>> createBatch(
            @RequestHeader("X-User-Id") Long usuarioId,
            @Valid @RequestBody List<CreateTransactionRequest> requests
    ) {
        List<TransactionResponse> response = transactionService.createBatch(usuarioId, requests);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Lista todas as transações do usuário.
     *
     * Quando dataInicial e dataFinal são informadas, a consulta
     * retorna apenas as transações dentro do período.
     */
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> findAll(
            @RequestHeader("X-User-Id") Long usuarioId,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicial,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFinal
    ) {
        validateOptionalPeriod(dataInicial, dataFinal);

        List<TransactionResponse> response;

        if (dataInicial != null) {
            response = transactionService.findAllByPeriod(
                    usuarioId,
                    dataInicial,
                    dataFinal
            );
        }
        else {
            response = transactionService.findAll(usuarioId);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Busca uma transação específica, validando se ela pertence
     * ao usuário informado no cabeçalho.
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> findById(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PathVariable Long transactionId
    ) {
        TransactionResponse response =
                transactionService.findById(usuarioId, transactionId);

        return ResponseEntity.ok(response);
    }

    /**
     * Atualiza completamente uma transação existente.
     *
     * Como o endpoint utiliza PUT, todos os campos do request
     * continuam obrigatórios.
     */
    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> update(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PathVariable Long transactionId,
            @Valid @RequestBody UpdateTransactionRequest request
    ) {
        TransactionResponse response =
                transactionService.update(
                        usuarioId,
                        transactionId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    /**
     * Exclui uma transação pertencente ao usuário.
     */
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PathVariable Long transactionId
    ) {
        transactionService.delete(usuarioId, transactionId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Evita consultas incompletas, como informar somente
     * a data inicial ou somente a data final.
     */
    private void validateOptionalPeriod(
            LocalDate dataInicial,
            LocalDate dataFinal
    ) {
        boolean onlyInitialDateWasProvided =
                dataInicial != null && dataFinal == null;

        boolean onlyFinalDateWasProvided =
                dataInicial == null && dataFinal != null;

        if (onlyInitialDateWasProvided || onlyFinalDateWasProvided) {
            throw new InvalidRequestException(
                    "Informe a data inicial e a data final para filtrar por período."
            );
        }
    }
}