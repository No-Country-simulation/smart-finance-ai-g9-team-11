import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderCircle,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/PasswordField";
import { BrandLogo } from "@/components/landing/BrandLogo";

import { useAuth } from "@/hooks/useAuth";

import { cn } from "@/lib/utils";

import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/auth.schema";

import { getApiErrorMessage } from "@/services/api";
import { registerUser } from "@/services/auth.service";

export function RegisterPage() {
  const {
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(
      registerSchema,
    ),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  if (isAuthenticated) {
    return (
      <Navigate
        to="/app"
        replace
      />
    );
  }

  const handleRegister = async (
    formData: RegisterFormData,
  ): Promise<void> => {
    try {
      await registerUser({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setError("root", {
        type: "server",
        message: getApiErrorMessage(
          error,
          "Não foi possível criar sua conta.",
        ),
      });
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <BrandLogo />

        <div className="mt-8">
          <div
            className={cn(
              "flex size-11",
              "items-center justify-center",
              "rounded-2xl",
              "bg-secondary/10",
              "text-secondary-bright",
            )}
          >
            <Sparkles
              size={22}
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-text">
            Crie sua conta
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Comece a acompanhar sua vida
            financeira com inteligência.
          </p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(
            handleRegister,
          )}
          noValidate
        >
          <AuthField
            label="Nome"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
            startIcon={
              <User
                size={17}
                aria-hidden="true"
              />
            }
            disabled={isSubmitting}
            error={errors.nome?.message}
            {...register("nome")}
          />

          <AuthField
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            autoComplete="email"
            startIcon={
              <Mail
                size={17}
                aria-hidden="true"
              />
            }
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordField
            label="Senha"
            placeholder="Crie uma senha"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.senha?.message}
            {...register("senha")}
          />

          <PasswordField
            label="Confirmar senha"
            placeholder="Repita sua senha"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={
              errors.confirmarSenha
                ?.message
            }
            {...register(
              "confirmarSenha",
            )}
          />

          {errors.root?.message ? (
            <div
              role="alert"
              className={cn(
                "rounded-xl border",
                "border-red-500/30",
                "bg-red-500/10",
                "px-4 py-3",
                "text-sm text-red-300",
              )}
            >
              {errors.root.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex h-12 w-full",
              "items-center justify-center",
              "gap-2 rounded-xl",
              "bg-primary",
              "px-4",
              "text-sm font-semibold",
              "text-white",
              "transition",
              "hover:bg-primary-bright",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary-bright",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
            )}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />

                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Já possui uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-bright hover:underline"
          >
            Entrar
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}