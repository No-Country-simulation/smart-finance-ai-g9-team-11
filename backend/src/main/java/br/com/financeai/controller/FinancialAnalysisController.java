package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisHistoryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.service.FinancialAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
                    Generates a financial analysis for the authenticated user
                    using the transactions registered within the informed period.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "Financial analysis completed successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "401",
            description = "Authentication required"
    )
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

    /**
     * Lista o histórico de análises financeiras
     * pertencentes ao usuário autenticado.
     */
    @Operation(
            summary = "List financial analyses",
            description = """
                    Returns all financial analyses belonging to the
                    currently authenticated user, ordered from newest
                    to oldest.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "Financial analyses retrieved successfully"
    )
    @ApiResponse(
            responseCode = "401",
            description = "Authentication required"
    )
    @GetMapping
    public ResponseEntity<List<FinancialAnalysisHistoryResponse>> findAll(
            @AuthenticationPrincipal AppUser loggedUser
    ) {
        List<FinancialAnalysisHistoryResponse> response =
                financialAnalysisService.findAll(loggedUser.getId());

        return ResponseEntity.ok(response);
    }

    /**
     * Busca uma análise específica, garantindo que ela
     * pertença ao usuário autenticado.
     */
    @Operation(
            summary = "Get financial analysis by ID",
            description = """
                    Returns a specific financial analysis only when it
                    belongs to the currently authenticated user.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "Financial analysis retrieved successfully"
    )
    @ApiResponse(
            responseCode = "401",
            description = "Authentication required"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Financial analysis not found"
    )
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

    /**
     * Exclui uma análise específica do usuário autenticado.
     */
    @Operation(
            summary = "Delete financial analysis",
            description = """
                    Permanently deletes a financial analysis only when it
                    belongs to the currently authenticated user.
                    """
    )
    @ApiResponse(
            responseCode = "204",
            description = "Financial analysis deleted successfully"
    )
    @ApiResponse(
            responseCode = "401",
            description = "Authentication required"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Financial analysis not found"
    )
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