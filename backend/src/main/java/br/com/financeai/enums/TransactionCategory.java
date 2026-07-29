package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionCategory {

    ALIMENTACAO("Alimentação"),

    MORADIA("Moradia"),

    COMPRAS("Compras"),

    ENTRETENIMENTO("Entretenimento"),

    INVESTIMENTO("Investimento"),

    SALARIO("Salário"),

    SAUDE("Saúde"),

    TRANSPORTE("Transporte"),

    UTILITARIOS("Utilitários"),

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