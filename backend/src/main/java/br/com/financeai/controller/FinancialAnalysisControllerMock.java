package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.service.FinancialAnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analise-financeira")
public class FinancialAnalysisControllerMock {

    @Autowired
    private FinancialAnalysisService financialAnalysisService;

    @PostMapping
    public ResponseEntity<FinancialAnalysisResponse> analyzeFinancialProfile(@RequestBody @Valid FinancialAnalysisRequest request) {
        // Mock response for testing purposes
        FinancialAnalysisResponse mockResponse = financialAnalysisService.analyze(request);


        return ResponseEntity.ok(mockResponse);
    }
}