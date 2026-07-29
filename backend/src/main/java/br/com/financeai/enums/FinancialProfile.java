package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FinancialProfile {

    SAUDAVEL("Saudavel"),

    EM_OBSERVACAO("Em observacao"),

    EM_RISCO("Em risco");

    private final String label;

    FinancialProfile(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
