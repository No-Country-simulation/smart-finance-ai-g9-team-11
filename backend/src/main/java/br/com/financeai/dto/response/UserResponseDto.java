package br.com.financeai.dto.response;

import br.com.financeai.entity.AppUser;

/** Dados públicos do usuário — nunca inclui a senha, mesmo criptografada. */
public record UserResponseDto(
        Long id,
        String nome,
        String email,
        boolean ativo
) {
    public UserResponseDto(AppUser usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.isAtivo());
    }
}
