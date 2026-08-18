import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getApiErrorMessage,
} from "@/services/api";

import {
  financialAnalysisService,
} from "@/services/financial-analysis.service";

import type {
  FinancialAnalysisHistory,
} from "@/types/financial-analysis";

interface UseLatestFinancialAnalysisReturn {
  analysis:
    FinancialAnalysisHistory | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function sortAnalysesByLatest(
  analyses:
    readonly FinancialAnalysisHistory[],
): FinancialAnalysisHistory[] {
  return [...analyses].sort(
    (first, second) => {
      const dateComparison =
        second.dataAnalise.localeCompare(
          first.dataAnalise,
        );

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return second.id - first.id;
    },
  );
}

export function useLatestFinancialAnalysis():
  UseLatestFinancialAnalysisReturn {
  const [
    analysis,
    setAnalysis,
  ] =
    useState<FinancialAnalysisHistory | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const loadLatestAnalysis =
    useCallback(
      async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
          const analyses =
            await financialAnalysisService.findAll();

          const orderedAnalyses =
            sortAnalysesByLatest(
              analyses,
            );

          setAnalysis(
            orderedAnalyses[0] ??
              null,
          );
        }
        catch (requestError) {
          setAnalysis(null);

          setError(
            getApiErrorMessage(
              requestError,
              "Não foi possível carregar a análise financeira.",
            ),
          );
        }
        finally {
          setIsLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadLatestAnalysis();
  }, [loadLatestAnalysis]);

  return {
    analysis,
    isLoading,
    error,
    reload:
      loadLatestAnalysis,
  };
}