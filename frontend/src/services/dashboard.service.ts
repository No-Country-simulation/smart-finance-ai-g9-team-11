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

  getFinancialHealth() {
    return dashboardMock.financialHealth;
  },

  getInsights() {
    return dashboardMock.financialHealth.insights;
  },

  getScore() {
    return dashboardMock.financialHealth;
  },

  getAlerts() {
    return dashboardMock.financialHealth.alerts;
  },

  async getDashboardData() {
    return Promise.resolve(dashboardMock);
  },
};