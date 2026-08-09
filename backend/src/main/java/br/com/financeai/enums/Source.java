package br.com.financeai.enums;

/**
 * Indica a origem de um resultado gerado automaticamente (categoria de
 * transação ou análise financeira) — se veio do serviço de Machine
 * Learning ({@link #ML}) ou do cálculo local de fallback ({@link #FALLBACK}),
 * usado quando a IA está indisponível.
 */
public enum Source {
    ML,
    FALLBACK
}

