package br.com.financeai.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/** Campos opcionais para atualização parcial do perfil do usuário. */
public record UserUpdateDto(
        @Size(max = 100, message = "O nome não pode ter mais de 100 caracteres")
        String nome,

        @Email(message = "Formato de e-mail inválido")
        @Size(max = 150, message = "O e-mail não pode ter mais de 150 caracteres")
        String email,

        @Size(min = 6, max = 20, message = "A senha deve conter entre 6 e 20 caracteres")
        String senha
) {}
