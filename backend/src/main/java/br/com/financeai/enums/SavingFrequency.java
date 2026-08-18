package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Frequência de poupança estimada do usuário no período analisado,
 * calculada a partir da proporção entre receitas e despesas.
 */
public enum SavingFrequency {

    NENHUMA("Nenhuma"),

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
