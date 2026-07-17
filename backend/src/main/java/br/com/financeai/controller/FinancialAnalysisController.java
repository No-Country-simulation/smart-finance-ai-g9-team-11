package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.service.FinancialAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;




@RestController
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
    @PostMapping("/analise-financeira")
    public ResponseEntity<FinancialAnalysisResponse> analise(@Valid @RequestBody FinancialAnalysisRequest request){


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
    public ExpenseSummaryResponse classificar(@Valid @RequestBody TransactionRequest request){
        return new ExpenseSummaryResponse(
                new BigDecimal("800.00"),
                new BigDecimal("200.00"),
                new BigDecimal("100.00"));
    }
}