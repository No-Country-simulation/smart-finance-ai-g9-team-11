import { dashboardMock } from "@/mocks/dashboard.mock";

export const dashboardService = {
  getSummary() {
    return dashboardMock.summary ?? [];
  },

  getCashFlow() {
    return dashboardMock.cashFlow ?? [];
  },

  getCategories() {
    return dashboardMock.categories ?? [];
  },

  getTransactions() {
    return dashboardMock.transactions ?? [];
  },

  getInsights() {
    return dashboardMock.insights ?? [];
  },

  async getDashboardData() {
    return Promise.resolve(dashboardMock);
  },
};
