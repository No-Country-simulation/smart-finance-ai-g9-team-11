package br.com.financeai.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FinancialAnalysisController {

//    @PostMapping("/analise-financeira")
    public String analise(){
        return """
                Dados mockados, endpoint analise-financeira:
                {
                    perfil_financeiro: Em observação,
                    probabilidade: 0.82,
                    resumo_gastos: {
                        alimentação: 420,
                        transporte: 300,
                        entretenimento: 40
                    },
                    recomendações: [
                        Monitorar gastos recorrentes de entretenimento,
                        Aumentar reserva financeira mensal
                        ]
                }""";
    }

    @PostMapping("/classificar-transacao")
    public String classificar(){
        return "Esse Endpoint é o de classificar-transacao";
    }
}
