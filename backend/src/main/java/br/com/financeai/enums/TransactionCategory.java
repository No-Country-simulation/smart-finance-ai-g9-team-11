package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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