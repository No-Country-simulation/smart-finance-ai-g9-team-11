package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisHistoryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.ApiErrorResponse;
import br.com.financeai.service.FinancialAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@Tag(
        name = "Financial Analysis",
        description = "Protected endpoints for generating and managing the authenticated user's financial analyses."
)
@RestController
@RequestMapping("/analise-financeira")
public class FinancialAnalysisController {

    private final FinancialAnalysisService financialAnalysisService;

    public FinancialAnalysisController(
            FinancialAnalysisService financialAnalysisService
    ) {
        this.financialAnalysisService = financialAnalysisService;
    }

    /**
     * Gera uma nova análise financeira utilizando as transações
     * do usuário autenticado dentro do período informado.
     */
    @Operation(
            summary = "Generate financial analysis",
            description = """
            Generates a financial analysis for the authenticated user based on
            the transactions registered within the informed period.

            Authentication:
            Requires a valid JWT access token in the Authorization header using
            the format: Bearer {token}.

            Behavior:
            Retrieves all transactions belonging to the authenticated user
            within the specified period and sends them to the Machine Learning
            service. If the ML service is unavailable, a local fallback analysis
            is generated automatically. The generated analysis is stored and
            returned to the client.
            """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Financial analysis generated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = FinancialAnalysisResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            )
    })
    @PostMapping
    public ResponseEntity<FinancialAnalysisResponse> analyze(
            @AuthenticationPrincipal AppUser loggedUser,
            @Valid @RequestBody FinancialAnalysisRequest request
    ) {
        FinancialAnalysisResponse response =
                financialAnalysisService.analyze(
                        loggedUser.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "List financial analyses",
            description = """
            Returns the complete history of financial analyses generated
            by the authenticated user.

            Authentication:
            Requires a valid JWT access token in the Authorization header using
            the format: Bearer {token}.

            Behavior:
            Returns only the analyses belonging to the authenticated user,
            ordered from the most recent to the oldest.
            """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Financial analyses retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = FinancialAnalysisHistoryResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<FinancialAnalysisHistoryResponse>> findAll(
            @AuthenticationPrincipal AppUser loggedUser
    ) {
        List<FinancialAnalysisHistoryResponse> response =
                financialAnalysisService.findAll(loggedUser.getId());

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get financial analysis",
            description = """
            Returns a specific financial analysis belonging to the
            authenticated user.

            Authentication:
            Requires a valid JWT access token in the Authorization header using
            the format: Bearer {token}.

            Behavior:
            Retrieves the requested analysis only if it belongs to the
            authenticated user. If the analysis does not exist or belongs
            to another user, a not found response is returned.
            """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Financial analysis retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = FinancialAnalysisHistoryResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Financial analysis not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            )
    })
    @GetMapping("/{analysisId}")
    public ResponseEntity<FinancialAnalysisHistoryResponse> findById(
            @AuthenticationPrincipal AppUser loggedUser,

            @Parameter(
                    description = "Identifier of the financial analysis",
                    example = "1"
            )
            @PathVariable Long analysisId
    ) {
        FinancialAnalysisHistoryResponse response =
                financialAnalysisService.findById(
                        loggedUser.getId(),
                        analysisId
                );

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Delete financial analysis",
            description = """
            Deletes a financial analysis belonging to the authenticated user.

            Authentication:
            Requires a valid JWT access token in the Authorization header using
            the format: Bearer {token}.

            Behavior:
            Removes the requested financial analysis only if it belongs
            to the authenticated user. If the analysis does not exist or
            belongs to another user, a not found response is returned.
            """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Financial analysis deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Financial analysis not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            )
    })
    @DeleteMapping("/{analysisId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal AppUser loggedUser,

            @Parameter(
                    description = "Identifier of the financial analysis",
                    example = "1"
            )
            @PathVariable Long analysisId
    ) {
        financialAnalysisService.delete(
                loggedUser.getId(),
                analysisId
        );

        return ResponseEntity.noContent().build();
    }
}