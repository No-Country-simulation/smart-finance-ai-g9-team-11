import { dashboardMock } from "@/mocks/dashboard.mock";

export const dashboardService = {
  getCashFlow() {
    return dashboardMock.cashFlow ?? [];
  },

  async getDashboardData() {
    return Promise.resolve(dashboardMock);
  },
};

