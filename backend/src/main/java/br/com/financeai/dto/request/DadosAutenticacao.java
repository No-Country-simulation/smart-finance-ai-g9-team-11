package br.com.financeai.dto.request;

import jakarta.validation.constraints.NotBlank;

/** Credenciais de login — reaproveitado também na reativação de conta. */
public record DadosAutenticacao(
        @NotBlank String email,
        @NotBlank String senha
) {}