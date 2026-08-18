import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O e-mail é obrigatório.")
    .email("Informe um e-mail válido.")
    .max(
      150,
      "O e-mail não pode ter mais de 150 caracteres.",
    ),

  senha: z
    .string()
    .min(1, "A senha é obrigatória.")
    .min(
      6,
      "A senha deve conter pelo menos 6 caracteres.",
    )
    .max(
      20,
      "A senha deve conter no máximo 20 caracteres.",
    ),
});

export const registerSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(1, "O nome é obrigatório.")
      .max(
        100,
        "O nome não pode ter mais de 100 caracteres.",
      ),

    email: z
      .string()
      .trim()
      .min(1, "O e-mail é obrigatório.")
      .email("Informe um e-mail válido.")
      .max(
        150,
        "O e-mail não pode ter mais de 150 caracteres.",
      ),

    senha: z
      .string()
      .min(1, "A senha é obrigatória.")
      .min(
        6,
        "A senha deve conter pelo menos 6 caracteres.",
      )
      .max(
        20,
        "A senha deve conter no máximo 20 caracteres.",
      ),

    confirmarSenha: z
      .string()
      .min(
        1,
        "Confirme sua senha.",
      ),
  })
  .refine(
    (data) =>
      data.senha === data.confirmarSenha,
    {
      message: "As senhas não coincidem.",
      path: ["confirmarSenha"],
    },
  );

export type LoginFormData =
  z.infer<typeof loginSchema>;

export type RegisterFormData =
  z.infer<typeof registerSchema>;