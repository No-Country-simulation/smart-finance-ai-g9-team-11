import {
  ArrowLeft,
  BrainCircuit,
} from "lucide-react";
import { Link } from "react-router-dom";

import { BrandLogo } from "@/components/landing/BrandLogo";
import { cn } from "@/lib/utils";

export function LoginPage() {
  return (
    <main
      className={cn(
        "relative flex min-h-dvh",
        "items-center justify-center",
        "overflow-hidden",
        "bg-background px-4 py-10",
        "text-text",
      )}
    >
      <div
        className={cn(
          "pointer-events-none",
          "absolute inset-0",
          "bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_65%)]",
          "opacity-45",
        )}
        aria-hidden="true"
      />

      <Link
        to="/"
        className={cn(
          "absolute left-4 top-4",
          "inline-flex items-center gap-2",
          "rounded-xl px-3 py-2",
          "text-sm font-medium",
          "text-text-muted",
          "hover:bg-surface-elevated",
          "hover:text-text",
          "sm:left-6 sm:top-6",
        )}
      >
        <ArrowLeft
          size={16}
          aria-hidden="true"
        />

        Voltar
      </Link>

      <section
        className={cn(
          "relative w-full max-w-md",
          "rounded-[24px] border",
          "border-border-highlight/60",
          "bg-surface/85 p-6",
          "shadow-elevated",
          "backdrop-blur-xl",
          "sm:p-8",
        )}
      >
        <BrandLogo />

        <div className="mt-8">
          <div
            className={cn(
              "flex size-11 items-center",
              "justify-center rounded-2xl",
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

        <div
          className={cn(
            "mt-8 rounded-2xl",
            "border border-border-muted",
            "bg-background/40 p-4",
            "text-sm leading-6",
            "text-text-muted",
          )}
        >
          O formulário de autenticação será
          conectado na próxima etapa.
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Ainda não possui uma conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary-bright hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  );
}