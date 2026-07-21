/**
 * Tipos de domínio financeiro compartilhados entre FinancialCard,
 * BalanceChart e ExpenseChart. Mantém esses componentes sem duplicar
 * a mesma forma de dado (valor + moeda + variação) cada um do seu jeito.
 */

export type Currency = "BRL" | "USD" | "EUR";

export type TrendDirection = "up" | "down" | "neutral";

export interface MoneyValue {
  amount: number;
  currency: Currency;
}

export interface FinancialMetric {
  label: string;
  value: MoneyValue;
  changePercent?: number;
  trend?: TrendDirection;
}

/**
 * Formata um MoneyValue pra exibição em pt-BR.
 * Fica aqui (não em utils/) porque é específico do domínio financeiro,
 * não uma função genérica de formatação de texto.
 */
export function formatMoney({ amount, currency }: MoneyValue): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function resolveTrend(changePercent?: number): TrendDirection {
  if (changePercent === undefined) return "neutral";
  if (changePercent > 0) return "up";
  if (changePercent < 0) return "down";
  return "neutral";
}
