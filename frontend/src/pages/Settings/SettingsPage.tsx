import type {
  LucideIcon,
} from "lucide-react";

import {
  Globe2,
  Mail,
  MoonStar,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import {
  ThemeToggle,
} from "@/components/layout/Header/ThemeToggle";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  cn,
} from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

interface SettingsRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  muted?: boolean;
}

function SettingsSection({
  title,
  description,
  children,
}: Readonly<SettingsSectionProps>) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <header className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-text">
          {title}
        </h2>

        <p className="mt-1 text-sm text-text-muted">
          {description}
        </p>
      </header>

      <div className="divide-y divide-border">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({
  icon: Icon,
  title,
  description,
  value,
  muted = false,
}: Readonly<SettingsRowProps>) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon
            size={19}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-text-muted">
            {description}
          </p>
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 text-sm font-semibold",
          muted
            ? "text-text-muted"
            : "text-text",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function SettingsPage() {
  const {
    user,
  } = useAuth();

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">
          Preferências
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Configurações
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-text-muted sm:text-base">
          Consulte as configurações disponíveis
          para sua conta no Finance AI.
        </p>
      </header>

      <SettingsSection
        title="Conta"
        description="Informações vinculadas à sua conta."
      >
        <SettingsRow
          icon={UserRound}
          title="Nome"
          description="Nome utilizado na sua conta."
          value={
            user?.nome ??
            "Não informado"
          }
        />

        <SettingsRow
          icon={Mail}
          title="E-mail"
          description="Endereço utilizado para autenticação."
          value={
            user?.email ??
            "Não informado"
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Geral"
        description="Configurações utilizadas atualmente pela aplicação."
      >
        <SettingsRow
          icon={Globe2}
          title="Idioma"
          description="Idioma utilizado na interface."
          value="Português (Brasil)"
        />

        <SettingsRow
          icon={WalletCards}
          title="Moeda principal"
          description="Moeda utilizada nos indicadores financeiros."
          value="BRL"
        />
      </SettingsSection>

      <SettingsSection
        title="Aparência"
        description="Escolha como a interface será exibida."
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MoonStar
                size={19}
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text">
                Tema da interface
              </h3>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Alterne entre os modos claro e escuro.
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Privacidade e segurança"
        description="Recursos de segurança da conta."
      >
        <SettingsRow
          icon={ShieldCheck}
          title="Status da conta"
          description="Situação atual da sua conta no Finance AI."
          value={
            user?.ativo
              ? "Ativa"
              : "Indisponível"
          }
        />

        <SettingsRow
          icon={ShieldCheck}
          title="Segurança avançada"
          description="Alteração de senha e autenticação em duas etapas."
          value="Em breve"
          muted
        />
      </SettingsSection>
    </section>
  );
}