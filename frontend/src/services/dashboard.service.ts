import { dashboardMock } from "@/mocks/dashboard.mock";

export async function getDashboardData() {
  return Promise.resolve(dashboardMock);
}