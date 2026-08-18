export const FINANCIAL_PROFILES = [
  "Saudável",
  "Em observação",
  "Em risco",
] as const;

export type FinancialProfile =
  (typeof FINANCIAL_PROFILES)[number];

export const SAVING_FREQUENCIES = [
  "Baixa",
  "Média",
  "Alta",
] as const;

export type SavingFrequency =
  (typeof SAVING_FREQUENCIES)[number];

export interface FinancialAnalysisRequest {
  data_inicial: string;
  data_final: string;
}

export interface ExpenseSummary {
  Alimentação: number;
  Moradia: number;
  Compras: number;
  Entretenimento: number;
  Investimento: number;
  Salário: number;
  Saúde: number;
  Trajeto: number;
  Utilitários: number;
  Outros: number;
}

export interface FinancialAnalysis {
  perfil_financeiro: FinancialProfile;
  nivel_endividamento: number;
  frequencia_poupanca: SavingFrequency;
  probabilidade: number;
  resumo_gastos: ExpenseSummary;
  recomendacoes: string[];
}

export interface FinancialAnalysisHistory {
  id: number;
  nivelEndividamento: number;
  frequenciaPoupanca: SavingFrequency;
  perfilFinanceiro: FinancialProfile;
  probabilidade: number;
  dataAnalise: string;
}