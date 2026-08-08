package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SavingFrequency {

    BAIXA("Baixa"),

    MEDIA("Média"),

    ALTA("Alta");

    private final String label;

    SavingFrequency(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    }
