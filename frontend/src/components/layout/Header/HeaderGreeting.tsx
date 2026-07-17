import { userMock } from "@/mocks/user.mock";

export function HeaderGreeting() {
  const firstName = userMock.name.split(" ")[0];

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-text">
        Olá, {firstName}! 
      </h1>

      <p className="mt-1 text-text-muted">
        Aqui está o resumo da sua saúde financeira de hoje.
      </p>
    </div>
  );
}
