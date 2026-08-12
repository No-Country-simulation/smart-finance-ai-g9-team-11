package br.com.financeai.service;


import br.com.financeai.dto.response.ExpenseSummaryResponse;
import br.com.financeai.dto.response.FinancialAnalysisResponse;
import br.com.financeai.entity.Transaction;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.enums.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Responsável pela geração local (fallback) de análises financeiras,
 * usada quando o serviço de Machine Learning está indisponível.
 * <p>
 * Calcula o perfil financeiro, nível de endividamento e frequência de
 * poupança através de regras determinísticas simples sobre o total de
 * receitas e despesas do período — não substitui a precisão do modelo
 * de IA, mas evita que a funcionalidade fique completamente indisponível.
 */
@Service
public class FinancialProfileService {

    private static final BigDecimal ALTA = BigDecimal.valueOf(40);
    private static final BigDecimal MEDIA = BigDecimal.valueOf(20);
    private static final BigDecimal BAIXA = BigDecimal.valueOf(10);

    /**
     * Gera uma análise simplificada baseada em regras determinísticas,
     * usada como fallback quando o serviço de ML está indisponível.
     */
    public FinancialAnalysisResponse gerarAnaliseFallback(List<Transaction> transactions) {

        BigDecimal totalReceitas = somarPorTipo(transactions, TransactionType.RECEITA);
        BigDecimal totalDespesas = somarPorTipo(transactions, TransactionType.DESPESA);

        FinancialProfile perfilFinanceiro = totalDespesas.compareTo(totalReceitas) > 0
                ? FinancialProfile.EM_RISCO
                : FinancialProfile.EM_OBSERVACAO;

        BigDecimal nivelEndividamento = totalReceitas.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : totalDespesas.multiply(BigDecimal.valueOf(100))
                .divide(totalReceitas, 2, RoundingMode.HALF_UP);

        SavingFrequency frequenciaPoupanca = getSavingFrequency(totalReceitas, totalDespesas);

        List<String> recomendacoes = new ArrayList<>();
        if (totalDespesas.compareTo(totalReceitas) > 0) {
            recomendacoes.add("Suas despesas superaram suas receitas neste período.");
        }
        recomendacoes.add("Análise gerada em modo simplificado — serviço de IA indisponível no momento.");

        return new FinancialAnalysisResponse(
                perfilFinanceiro,
                nivelEndividamento,
                frequenciaPoupanca,
                BigDecimal.ZERO,
                calcularResumoGastos(transactions),
                recomendacoes
        );
    }

    private static SavingFrequency getSavingFrequency(BigDecimal totalReceitas, BigDecimal totalDespesas) {
        BigDecimal sobra = totalReceitas.subtract(totalDespesas);
        BigDecimal percentualSobra;

        if (totalReceitas.compareTo(BigDecimal.ZERO) == 0){
           percentualSobra = BigDecimal.ZERO;
        } else {
            percentualSobra = sobra.multiply(BigDecimal.valueOf(100))
                    .divide(totalReceitas, 2, RoundingMode.HALF_UP);
        }

        SavingFrequency frequenciaPoupanca;

        if (sobra.compareTo(BigDecimal.ZERO) <= 0) {
            return SavingFrequency.NENHUMA;
        }
        else if (percentualSobra.compareTo(ALTA) >= 0){
             frequenciaPoupanca = SavingFrequency.ALTA;
        } else if (percentualSobra.compareTo(MEDIA) >= 0) {
             frequenciaPoupanca = SavingFrequency.MEDIA;
        } else if (percentualSobra.compareTo(BAIXA) >= 0){
             frequenciaPoupanca = SavingFrequency.BAIXA;
        } else {
            frequenciaPoupanca = SavingFrequency.NENHUMA;
        }
        return frequenciaPoupanca;
    }

    private BigDecimal somarPorTipo(List<Transaction> transactions, TransactionType tipo) {
        return transactions.stream()
                .filter(t -> t.getTipo() == tipo)
                .map(Transaction::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public ExpenseSummaryResponse calcularResumoGastos(List<Transaction> transactions){
        Map<TransactionCategory, BigDecimal> porCategoria = transactions.stream()
                .filter(t -> t.getTipo() == TransactionType.DESPESA)
                .collect(Collectors.groupingBy(
                        Transaction::getCategoria,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getValor, BigDecimal::add)));

        return new ExpenseSummaryResponse(
                porCategoria.getOrDefault(TransactionCategory.ALIMENTACAO, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.MORADIA, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.UTILITARIOS, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.INVESTIMENTO, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.COMPRAS, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.SAUDE, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.ENTRETENIMENTO, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.TRAJETO, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.SALARIO, BigDecimal.ZERO),
                porCategoria.getOrDefault(TransactionCategory.OUTROS, BigDecimal.ZERO)
        );
    }
}