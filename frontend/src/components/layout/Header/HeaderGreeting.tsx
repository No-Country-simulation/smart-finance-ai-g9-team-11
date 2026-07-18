import { userMock } from "@/mocks/user.mock";

export function HeaderGreeting() {
  const firstName =
    userMock.name.trim().split(/\s+/)[0] ?? "usuário";

  return (
    <div className="min-w-0">
      <h1 className="truncate text-xl font-bold tracking-tight text-text sm:text-2xl lg:text-3xl xl:text-4xl">
        Olá, {firstName}!
      </h1>

      <p className="mt-1 hidden text-sm text-text-muted sm:block lg:text-base">
        Aqui está o resumo da sua saúde financeira de hoje.
      </p>
    </div>
  );
}