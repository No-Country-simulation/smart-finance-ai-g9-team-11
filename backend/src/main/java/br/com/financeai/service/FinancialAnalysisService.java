package br.com.financeai.service;

import br.com.financeai.dto.request.FinancialAnalysisRequest;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.FinancialAnalysis;
import br.com.financeai.exception.InvalidRequestException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlRequest;
import br.com.financeai.integration.dto.response.MlResponse;
import br.com.financeai.repository.FinancialAnalysisRepository;
import br.com.financeai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FinancialAnalysisService {

    private static final String TEST_USER_EMAIL = "teste@financeai.com";

    private final FinancialAnalysisRepository financialAnalysisRepository;
    private final UserRepository userRepository;
    private final MlClient mlClient;

    public FinancialAnalysisService(
            MlClient mlClient,
            FinancialAnalysisRepository financialAnalysisRepository,
            UserRepository userRepository
    ) {
        this.mlClient = mlClient;
        this.financialAnalysisRepository = financialAnalysisRepository;
        this.userRepository = userRepository;
    }

    public FinancialAnalysisResponse analyze(
            FinancialAnalysisRequest analysisRequest
    ) {
        validateRequest(analysisRequest);

        MlRequest mlRequest = new MlRequest(
                analysisRequest.rendaMensal(),
                analysisRequest.nivelEndividamento(),
                analysisRequest.frequenciaPoupanca(),
                analysisRequest.transacoes()
        );

        MlResponse mlResponse = mlClient.analyze(mlRequest);

        AppUser appUser = userRepository
                .findByEmail(TEST_USER_EMAIL)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário de teste não encontrado."
                        )
                );

        FinancialAnalysis analysis = new FinancialAnalysis();
        analysis.setUsuario(appUser);
        analysis.setRendaMensal(analysisRequest.rendaMensal());
        analysis.setNivelEndividamento(
                analysisRequest.nivelEndividamento()
        );
        analysis.setFrequenciaPoupanca(
                analysisRequest.frequenciaPoupanca()
        );
        analysis.setDataAnalise(LocalDateTime.now());
        analysis.setPerfilFinanceiro(
                mlResponse.perfilFinanceiro()
        );
        analysis.setProbabilidade(
                mlResponse.probabilidade()
        );

        financialAnalysisRepository.save(analysis);

        return new FinancialAnalysisResponse(
                mlResponse.perfilFinanceiro(),
                mlResponse.probabilidade(),
                mlResponse.resumoGastos(),
                mlResponse.recomendacoes()
        );
    }

    private void validateRequest(
            FinancialAnalysisRequest analysisRequest
    ) {
        if (analysisRequest.transacoes() == null
                || analysisRequest.transacoes().isEmpty()) {
            throw new InvalidRequestException(
                    "A lista de transações não pode estar vazia."
            );
        }

        boolean rendaMensalZerada = analysisRequest
                .rendaMensal()
                .compareTo(BigDecimal.ZERO) == 0;

        if (rendaMensalZerada
                && analysisRequest.transacoes().size() > 10) {
            throw new InvalidRequestException(
                    "Informação financeira inválida."
            );
        }



    }
}