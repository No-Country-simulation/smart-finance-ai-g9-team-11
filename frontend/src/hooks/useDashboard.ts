import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getApiErrorMessage,
} from "@/services/api";
import { dashboardService } from "@/services/dashboard.service";

import type {
  DashboardData,
} from "@/types/dashboard";

const INITIAL_DASHBOARD_DATA: DashboardData = {
  summary: {
    balance: 0,
    income: 0,
    expenses: 0,
    transactionCount: 0,
  },
  cashFlow: [],
  categories: [],
  transactions: [],
};

interface UseDashboardReturn {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] =
    useState<DashboardData>(
      INITIAL_DASHBOARD_DATA,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const dashboardData =
          await dashboardService.getDashboardData();

        setData(dashboardData);
      }
      catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar os dados do dashboard.",
          ),
        );
      }
      finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    isLoading,
    error,
    reload: loadDashboard,
  };
}