import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { userMock } from "@/mocks/user.mock";
import { cn } from "@/lib/utils";

function getUserInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatMemberSince(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

interface ProfileInformationProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function ProfileInformation({
  icon: Icon,
  label,
  value,
}: Readonly<ProfileInformationProps>) {
  return (
    <div className="flex min-w-0 items-start gap-3 bg-surface p-5 sm:p-6">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted">
        <Icon size={17} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-text">
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const initials = getUserInitials(userMock.name);

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
            Consulte seus dados e preferências da conta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className={cn(
            "inline-flex h-10 items-center justify-center",
            "rounded-xl bg-primary px-4",
            "text-sm font-semibold text-primary-foreground",
            "transition-opacity hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary focus-visible:ring-offset-2",
          )}
        >
          Editar configurações
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="border-b border-border bg-primary/5 p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 border-4 border-surface shadow-card sm:size-24">
              <AvatarImage
                src={userMock.avatar}
                alt={`Foto de ${userMock.name}`}
              />

              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold text-text">
                {userMock.name}
              </h2>

              <p className="mt-1 truncate text-sm text-text-muted">
                {userMock.email}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <ShieldCheck size={14} aria-hidden="true" />
                Perfil financeiro {userMock.financialProfile}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          <ProfileInformation
            icon={Mail}
            label="E-mail"
            value={userMock.email}
          />

          <ProfileInformation
            icon={Phone}
            label="Telefone"
            value={userMock.phone ?? "Não informado"}
          />

          <ProfileInformation
            icon={BriefcaseBusiness}
            label="Profissão"
            value={userMock.occupation ?? "Não informada"}
          />

          <ProfileInformation
            icon={CalendarDays}
            label="Membro desde"
            value={formatMemberSince(userMock.memberSince)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound size={19} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-text">
              Dados da conta
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Nesta versão do MVP, os dados são demonstrativos.
              A edição persistente será conectada ao Spring Boot
              em uma etapa futura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}