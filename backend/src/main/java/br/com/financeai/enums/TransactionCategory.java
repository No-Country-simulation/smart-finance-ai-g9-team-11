package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Categoria atribuída a uma transação — sempre definida pela classificação
 * automática (IA ou fallback local), nunca informada pelo usuário.
 */
public enum TransactionCategory {

    ALIMENTACAO("Alimentação"),

    UTILITARIOS("Utilitários"),

    MORADIA("Moradia"),

    INVESTIMENTO("Investimento"),

    COMPRAS("Compras"),

    SAUDE("Saúde"),

    ENTRETENIMENTO("Entretenimento"),

    TRAJETO("Trajeto"),

    SALARIO("Salário"),

    OUTROS("Outros");

    private final String label;

    TransactionCategory(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

}