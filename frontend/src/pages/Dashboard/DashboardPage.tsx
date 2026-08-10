import {
  AlertTriangle,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  DashboardGrid,
} from "@/components/dashboard/DashbordGrid/DashboardGrid";

import {
  useDashboard,
} from "@/hooks/useDashboard";

import {
  useLatestFinancialAnalysis,
} from "@/hooks/useLatestFinancialAnalysis";

import {
  cn,
} from "@/lib/utils";

export function DashboardPage() {
  const {
    data,
    isLoading,
    error,
    reload,
  } = useDashboard();

  const {
    analysis,
    isLoading:
      isAnalysisLoading,
    reload:
      reloadAnalysis,
  } =
    useLatestFinancialAnalysis();

  const handleReload =
    async (): Promise<void> => {
      await Promise.all([
        reload(),
        reloadAnalysis(),
      ]);
    };

  if (isLoading) {
    return (
      <main
        className={cn(
          "flex min-h-[420px]",
          "items-center",
          "justify-center",
        )}
      >
        <div className="text-center">
          <LoaderCircle
            className={cn(
              "mx-auto size-8",
              "animate-spin",
              "text-primary-bright",
            )}
            aria-hidden="true"
          />

          <p className="mt-4 text-sm font-semibold text-text">
            Carregando suas finanças...
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Buscando suas transações.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className={cn(
          "flex min-h-[420px]",
          "items-center",
          "justify-center",
        )}
      >
        <div
          className={cn(
            "w-full max-w-md",
            "rounded-[18px]",
            "border border-danger/20",
            "bg-danger/5 p-6",
            "text-center",
          )}
        >
          <AlertTriangle
            size={24}
            className="mx-auto text-danger"
          />

          <h2 className="mt-4 text-sm font-semibold text-text">
            Não foi possível carregar o dashboard
          </h2>

          <p className="mt-2 text-xs leading-5 text-text-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void handleReload();
            }}
            className={cn(
              "mt-5 inline-flex",
              "h-10 items-center",
              "justify-center gap-2",
              "rounded-[12px]",
              "bg-primary px-4",
              "text-xs font-semibold",
              "text-white",
            )}
          >
            <RefreshCw
              size={14}
            />

            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-2">
      <DashboardGrid
        data={data}
        analysis={analysis}
        isAnalysisLoading={
          isAnalysisLoading
        }
        onReload={
          handleReload
        }
      />
    </main>
  );
}

export default DashboardPage;