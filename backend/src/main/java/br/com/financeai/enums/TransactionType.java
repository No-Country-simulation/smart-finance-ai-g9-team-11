package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Identifica a natureza da movimentação financeira.
 * <p>
 * RECEITA representa uma entrada de dinheiro.
 * DESPESA representa uma saída de dinheiro.
 */
public enum TransactionType {
    RECEITA("Receita"),
    DESPESA("Despesa");
    private final String label;

    TransactionType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}