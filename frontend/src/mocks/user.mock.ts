import type { User } from "@/types/user";

export const userMock: User = {
  id: "user-001",
  name: "Mariana Costa",
  email: "mariana.costa@email.com",
  avatar: "",
  phone: "(98) 99999-9999",
  occupation: "Analista financeira",
  financialProfile: "Excelente",
  memberSince: "2026-01-15",

  preferences: {
    currency: "BRL",
    language: "pt-BR",
    receiveFinancialAlerts: true,
    receiveAiRecommendations: true,
    receiveMonthlySummary: true,
  },
};