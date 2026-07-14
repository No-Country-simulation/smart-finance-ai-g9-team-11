package br.com.financeai.controller;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.math.BigDecimal;

@RestController
public class FinancialAnalysisController {

    @PostMapping("/analise-financeira")
    public FinancialAnalysisResponse analise(@Valid @RequestBody FinancialAnalysisRequest request){
        return new FinancialAnalysisResponse(
                "Em observação",
                0.82,
                new ExpenseSummaryResponse(
                        new BigDecimal("800.00"),
                        new BigDecimal("200.00"),
                        new BigDecimal("100.00")),
                List.of("Monitor gastos", "Aumentar reserva")
        );
    }

    @PostMapping("/classificar-transacao")
    public ExpenseSummaryResponse classificar(@Valid @RequestBody TransactionRequest request){
        return new ExpenseSummaryResponse(
                new BigDecimal("800.00"),
                new BigDecimal("200.00"),
                new BigDecimal("100.00"));
    }
}
