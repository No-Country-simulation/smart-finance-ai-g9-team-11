import { api } from "@/services/api";

import type {
  FinancialAnalysis,
  FinancialAnalysisHistory,
  FinancialAnalysisRequest,
} from "@/types/financial-analysis";

const FINANCIAL_ANALYSIS_RESOURCE =
  "/analise-financeira";

function validateAnalysisPeriod(
  request: FinancialAnalysisRequest,
): void {
  if (
    !request.data_inicial ||
    !request.data_final
  ) {
    throw new Error(
      "Informe a data inicial e a data final.",
    );
  }

  if (
    request.data_inicial >
    request.data_final
  ) {
    throw new Error(
      "A data inicial não pode ser posterior à data final.",
    );
  }

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  if (
    request.data_inicial >
    today
  ) {
    throw new Error(
      "Não é possível analisar um período que ainda não começou.",
    );
  }
}

export const financialAnalysisService = {
  async create(
    request: FinancialAnalysisRequest,
  ): Promise<FinancialAnalysis> {
    validateAnalysisPeriod(
      request,
    );

    const response =
      await api.post<FinancialAnalysis>(
        FINANCIAL_ANALYSIS_RESOURCE,
        request,
      );

    return response.data;
  },

  async findAll(): Promise<
    FinancialAnalysisHistory[]
  > {
    const response =
      await api.get<
        FinancialAnalysisHistory[]
      >(
        FINANCIAL_ANALYSIS_RESOURCE,
      );

    return response.data;
  },

  async findById(
    analysisId: number,
  ): Promise<FinancialAnalysisHistory> {
    const response =
      await api.get<FinancialAnalysisHistory>(
        `${FINANCIAL_ANALYSIS_RESOURCE}/${analysisId}`,
      );

    return response.data;
  },

  async remove(
    analysisId: number,
  ): Promise<void> {
    await api.delete(
      `${FINANCIAL_ANALYSIS_RESOURCE}/${analysisId}`,
    );
  },
};