package br.com.financeai.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Perfil financeiro resultante de uma análise, indicando o nível geral
 * de saúde financeira do usuário no período analisado.
 */
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
