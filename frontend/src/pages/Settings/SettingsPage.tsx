import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  BrainCircuit,
  Globe2,
  MoonStar,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/layout/Header/ThemeToggle";
import { userMock } from "@/mocks/user.mock";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
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

interface SettingsRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  muted?: boolean;
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
          <Icon size={19} aria-hidden="true" />
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
          muted ? "text-text-muted" : "text-text",
        )}
      >
        {value}
      </span>
    </div>
  );
}

interface SettingsToggleProps {
  icon: LucideIcon;
  title: string;
  description: string;
  defaultChecked: boolean;
}

function SettingsToggle({
  icon: Icon,
  title,
  description,
  defaultChecked,
}: Readonly<SettingsToggleProps>) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 sm:items-center sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={19} aria-hidden="true" />
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

      <label className="relative mt-1 inline-flex shrink-0 cursor-pointer items-center sm:mt-0">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
          aria-label={title}
        />

        <span
          className={cn(
            "relative h-6 w-11 rounded-full bg-surface-muted",
            "transition-colors duration-200",
            "peer-checked:bg-primary",
            "peer-focus-visible:ring-2",
            "peer-focus-visible:ring-primary",
            "peer-focus-visible:ring-offset-2",
            "after:absolute after:left-1 after:top-1",
            "after:size-4 after:rounded-full after:bg-white",
            "after:shadow-sm after:transition-transform",
            "peer-checked:after:translate-x-5",
          )}
        />
      </label>
    </div>
  );
}

export function SettingsPage() {
  const languageLabel =
    userMock.preferences.language === "pt-BR"
      ? "Português (Brasil)"
      : "English";

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
          Personalize a experiência e escolha quais informações
          deseja receber do Finance AI.
        </p>
      </header>

      <SettingsSection
        title="Geral"
        description="Preferências básicas de idioma e moeda."
      >
        <SettingsRow
          icon={Globe2}
          title="Idioma"
          description="Idioma utilizado na interface."
          value={languageLabel}
        />

        <SettingsRow
          icon={WalletCards}
          title="Moeda principal"
          description="Moeda utilizada nos indicadores financeiros."
          value={userMock.preferences.currency}
        />
      </SettingsSection>

      <SettingsSection
        title="Aparência"
        description="Escolha como a interface será exibida."
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MoonStar size={19} aria-hidden="true" />
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
        title="Notificações"
        description="Controle as comunicações financeiras."
      >
        <SettingsToggle
          icon={BellRing}
          title="Alertas financeiros"
          description="Receber avisos sobre gastos elevados e riscos."
          defaultChecked={
            userMock.preferences.receiveFinancialAlerts
          }
        />

        <SettingsToggle
          icon={BrainCircuit}
          title="Recomendações da IA"
          description="Receber orientações personalizadas do Finance AI."
          defaultChecked={
            userMock.preferences.receiveAiRecommendations
          }
        />

        <SettingsToggle
          icon={WalletCards}
          title="Resumo mensal"
          description="Receber um resumo da evolução financeira."
          defaultChecked={
            userMock.preferences.receiveMonthlySummary
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Privacidade e segurança"
        description="Recursos de segurança da conta."
      >
        <SettingsRow
          icon={ShieldCheck}
          title="Segurança da conta"
          description="Alteração de senha e autenticação em duas etapas."
          value="Em breve"
          muted
        />
      </SettingsSection>
    </section>
  );
}