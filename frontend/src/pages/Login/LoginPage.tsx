import { zodResolver } from "@hookform/resolvers/zod";
import {
  BrainCircuit,
  LoaderCircle,
  Mail,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
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
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth.schema";

import { getApiErrorMessage } from "@/services/api";

interface LoginLocationState {
  from?: string;
}

export function LoginPage() {
  const {
    login,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
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

  const handleLogin = async (
    formData: LoginFormData,
  ): Promise<void> => {
    try {
      await login(formData);

      const state =
        location.state as
          | LoginLocationState
          | null;

      navigate(
        state?.from ?? "/app",
        {
          replace: true,
        },
      );
    } catch (error) {
      setError("root", {
        type: "server",
        message: getApiErrorMessage(
          error,
          "E-mail ou senha inválidos.",
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
              "bg-primary/10",
              "text-primary-bright",
            )}
          >
            <BrainCircuit
              size={22}
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-text">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Entre para acessar seu painel
            financeiro.
          </p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(
            handleLogin,
          )}
          noValidate
        >
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
            placeholder="Digite sua senha"
            autoComplete="current-password"
            disabled={isSubmitting}
            error={errors.senha?.message}
            {...register("senha")}
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

                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Ainda não possui uma conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary-bright hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}