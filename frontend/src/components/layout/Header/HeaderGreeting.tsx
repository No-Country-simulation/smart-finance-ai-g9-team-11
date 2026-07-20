import { Sparkles } from "lucide-react";

import { userMock } from "@/mocks/user.mock";

export function HeaderGreeting() {
  const firstName =
    userMock.name.trim().split(/\s+/)[0] ?? "usuário";

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        

        <p className="truncate text-[11px] font-medium text-text-muted sm:text-xs">
          Bem-vindo de volta
        </p>

        <span
          className="
            hidden size-6 shrink-0 items-center justify-center
            rounded-lg border border-primary/25
            bg-primary/10 text-primary-bright
            sm:flex
          "
          aria-hidden="true"
        >
          <Sparkles size={13} />
        </span>

      </div>

      <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-text sm:text-xl lg:text-[22px]">
        Olá, {firstName}
      </h1>

      <p className="mt-0.5 hidden truncate text-xs text-text-subtle lg:block">
        Acompanhe sua saúde financeira e os insights da sua IA.
      </p>
    </div>
  );
}