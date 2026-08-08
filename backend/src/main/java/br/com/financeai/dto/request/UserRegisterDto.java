package br.com.financeai.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegisterDto(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome não pode ter mais de 100 caracteres")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        @Size(max = 150, message = "O e-mail não pode ter mais de 150 caracteres")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, max = 20, message = "A senha deve conter entre 6 e 20 caracteres")
        String senha
) {}
