package br.com.financeai.dto.request;

import jakarta.validation.constraints.NotBlank;

public record DadosAutenticacao(
        @NotBlank String email,
        @NotBlank String senha
) {}