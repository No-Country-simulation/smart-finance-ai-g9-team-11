package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FinancialProfile {

    SAUDAVEL("Saudável"),

    EM_OBSERVACAO("Em observação"),

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
