package br.com.financeai.controller;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import br.com.financeai.entity.AppUser;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import br.com.financeai.exception.ApiErrorResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;

import java.time.LocalDate;
import java.util.List;


/**
 * Endpoints de CRUD de transações do usuário autenticado: criação
 * (única ou em lote), listagem (com filtro opcional de período),
 * busca por id, atualização e exclusão.
 */
@Tag(
        name = "Transactions",
        description = "Protected endpoints for creating, classifying and managing the authenticated user's financial transactions."
)
@RestController
@RequestMapping("/classificar-transacoes")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @Operation(
            summary = "Create and classify a transaction",
            description = """
                Creates a financial transaction for the currently authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Sends the transaction description to the Machine Learning service,
                receives the predicted category and stores the classified transaction
                in the database.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Transaction created and classified successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = TransactionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid transaction data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "502",
                    description = "Machine Learning service rejected the request or returned an invalid response",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "503",
                    description = "Machine Learning service is unavailable",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @AuthenticationPrincipal AppUser loggedUser, @Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.create(loggedUser.getId(), request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(
            summary = "Create and classify multiple transactions",
            description = """
                Creates and classifies multiple financial transactions for the
                currently authenticated user in a single request.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Sends each transaction to the Machine Learning classification flow,
                associates the results with the authenticated user and stores the
                classified transactions in the database. This operation is useful
                for statement imports or batch registration.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Transactions created and classified successfully",
                    content = @Content(
                            mediaType = "application/json",
                            array = @io.swagger.v3.oas.annotations.media.ArraySchema(
                                    schema = @Schema(implementation = TransactionResponse.class)
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid transaction list or transaction data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "502",
                    description = "Machine Learning service rejected the request or returned an invalid response",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "503",
                    description = "Machine Learning service is unavailable",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @PostMapping("/batch")
    public ResponseEntity<List<TransactionResponse>> createBatch(
            @AuthenticationPrincipal AppUser loggedUser,
            @Valid @RequestBody List<CreateTransactionRequest> requests
    ) {
        List<TransactionResponse> response = transactionService.createBatch(loggedUser.getId(), requests);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(
            summary = "List authenticated user's transactions",
            description = """
                Returns the financial transactions that belong to the currently
                authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Without query parameters, returns all transactions owned by the user.
                When both dataInicial and dataFinal are provided, returns only the
                transactions within the inclusive date range. Both dates must be sent
                together using the format yyyy-MM-dd.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Transactions retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(implementation = TransactionResponse.class)
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Incomplete or invalid date range",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> findAll(
            @AuthenticationPrincipal AppUser loggedUser,

            @Parameter(
                    description = "Start date of the optional filter, in yyyy-MM-dd format. Must be provided together with dataFinal.",
                    example = "2026-07-01"
            )
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicial,

            @Parameter(
                    description = "End date of the optional filter (yyyy-MM-dd). Must be provided together with dataInicial.",
                    example = "2026-07-31"
            )
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFinal
    ) {
        validateOptionalPeriod(dataInicial, dataFinal);

        List<TransactionResponse> response;

        if (dataInicial != null) {
            response = transactionService.findAllByPeriod(
                    loggedUser.getId(),
                    dataInicial,
                    dataFinal
            );
        }
        else {
            response = transactionService.findAll(loggedUser.getId());
        }

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get a transaction by ID",
            description = """
                Returns a specific financial transaction owned by the currently
                authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Retrieves the transaction only when it belongs to the authenticated
                user. A transaction owned by another user must not be exposed.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Transaction retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = TransactionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Transaction not found for the authenticated user",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> findById(
            @AuthenticationPrincipal AppUser loggedUser,

            @Parameter(
                    description = "Identifier of the transaction to retrieve.",
                    example = "15"
            )
            @PathVariable Long transactionId
    ) {
        TransactionResponse response =
                transactionService.findById(loggedUser.getId(), transactionId);

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Update a transaction",
            description = """
                Fully updates a financial transaction owned by the currently
                authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Because this endpoint uses PUT, all required transaction fields must
                be provided. The transaction is updated only when it belongs to the
                authenticated user.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Transaction updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = TransactionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid transaction data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Transaction not found for the authenticated user",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Transaction could not be updated because of a business conflict",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> update(
            @AuthenticationPrincipal AppUser loggedUser,

            @Parameter(
                    description = "Identifier of the transaction to update.",
                    example = "15"
            )
            @PathVariable Long transactionId,
            @Valid @RequestBody UpdateTransactionRequest request
    ) {
        TransactionResponse response =
                transactionService.update(
                        loggedUser.getId(),
                        transactionId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Delete a transaction",
            description = """
                Permanently deletes a financial transaction owned by the currently
                authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Deletes the transaction only when it belongs to the authenticated user.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Transaction deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Transaction not found for the authenticated user",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal AppUser loggedUser,

            @Parameter(
                    description = "Identifier of the transaction to delete.",
                    example = "15"
            )
            @PathVariable Long transactionId
    ) {
        transactionService.delete(loggedUser.getId(), transactionId);

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