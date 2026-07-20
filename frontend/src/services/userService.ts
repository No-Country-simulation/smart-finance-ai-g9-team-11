export type UserFinancialProfile =
  | "Excelente"
  | "Bom"
  | "Regular"
  | "Baixo";

export type UserCurrency = "BRL" | "USD" | "EUR";

export type UserLanguage = "pt-BR" | "en-US";

export interface UserPreferences {
  currency: UserCurrency;
  language: UserLanguage;
  receiveFinancialAlerts: boolean;
  receiveAiRecommendations: boolean;
  receiveMonthlySummary: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  occupation?: string;
  financialProfile: UserFinancialProfile;
  memberSince: string;
  preferences: UserPreferences;
}