package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.service.FinancialAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/analise-financeira")
public class FinancialAnalysisController {

    private final FinancialAnalysisService financialAnalysisService;

    public FinancialAnalysisController(FinancialAnalysisService financialAnalysisService) {
        this.financialAnalysisService = financialAnalysisService;

    }

    @Operation(
            summary = "Analyze financial profile",
            description = "Receives the user's financial data and returns a mocked financial analysis."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Financial analysis completed seccessfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @PostMapping
    public ResponseEntity<FinancialAnalysisResponse> analyze(
            @AuthenticationPrincipal AppUser loggedUser,
            @Valid @RequestBody  FinancialAnalysisRequest request) {

        Long usuarioId = loggedUser.getId();

        return ResponseEntity.ok(financialAnalysisService.analyze(usuarioId, request));

    }
}