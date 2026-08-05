package br.com.financeai.dto.response;

import br.com.financeai.entity.AppUser;

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
