import {
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  useAuth,
} from "@/hooks/useAuth";

import { cn } from "@/lib/utils";

function getUserInitials(
  name: string,
): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

export function ProfilePage() {
  const navigate = useNavigate();

  const {
    user,
  } = useAuth();

  if (!user) {
    return null;
  }

  const initials =
    getUserInitials(user.nome);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary">
            Conta
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Meu perfil
          </h1>

          <p className="mt-2 text-sm text-text-muted sm:text-base">
            Consulte os dados da sua conta.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/settings")
          }
          className={cn(
            "inline-flex h-10 items-center justify-center",
            "rounded-xl bg-primary px-4",
            "text-sm font-semibold text-primary-foreground",
            "transition-opacity hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary focus-visible:ring-offset-2",
          )}
        >
          Configurações
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="border-b border-border bg-primary/5 p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 border-4 border-surface shadow-card sm:size-24">
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold text-text">
                {user.nome}
              </h2>

              <p className="mt-1 truncate text-sm text-text-muted">
                {user.email}
              </p>

              <div
                className={cn(
                  "mt-3 inline-flex items-center gap-2",
                  "rounded-full px-3 py-1",
                  "text-xs font-semibold",
                  user.ativo
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger",
                )}
              >
                <ShieldCheck
                  size={14}
                  aria-hidden="true"
                />

                {user.ativo
                  ? "Conta ativa"
                  : "Conta inativa"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          <div className="flex min-w-0 items-start gap-3 bg-surface p-5 sm:p-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted">
              <UserRound
                size={17}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Nome
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-text">
                {user.nome}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3 bg-surface p-5 sm:p-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted">
              <Mail
                size={17}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                E-mail
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-text">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-text">
              Dados da conta
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              As informações exibidas são fornecidas
              diretamente pela sua conta no Finance AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}