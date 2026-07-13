import { DashboardGrid } from "@/components/dashboard/DashobordGrid";

export function DashboardPage() {
  return (
    <main className="space-y-2">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Bem-vindo ao Finance AI.
        </p>
      </header>

      <DashboardGrid />
    </main>
  );
}

export default DashboardPage;