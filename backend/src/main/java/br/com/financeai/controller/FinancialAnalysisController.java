package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.dto.response.TransactionClassificationResponse;
import br.com.financeai.service.FinancialAnalysisService;
import br.com.financeai.service.TransactionClassificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class FinancialAnalysisController {

    private final FinancialAnalysisService financialAnalysisService;
    private final TransactionClassificationService transactionClassificationService;


    public FinancialAnalysisController(FinancialAnalysisService financialAnalysisService, TransactionClassificationService transactionClassificationService) {
        this.financialAnalysisService = financialAnalysisService;
        this.transactionClassificationService = transactionClassificationService;
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
    @PostMapping("/analise-financeira")
    public ResponseEntity<FinancialAnalysisResponse> analyze(@Valid @RequestBody FinancialAnalysisRequest request) {

        return ResponseEntity.ok(financialAnalysisService.analyze(request));

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
    @PostMapping("/classificar-transacao")
    public ResponseEntity<TransactionClassificationResponse> classify(
            @RequestBody TransactionRequest request
    ) {

        return ResponseEntity.ok(
                transactionClassificationService.classify(request)
        );
    }
}