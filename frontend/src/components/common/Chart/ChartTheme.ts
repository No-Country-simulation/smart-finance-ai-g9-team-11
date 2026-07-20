// Re-exported here so chart components can `import { useChartTheme } from "./ChartTheme"`
// as named in the design-system brief. The actual implementation lives in
// src/styles/charts.ts (single source of truth, shared with styles/tokens.ts).
export { getChartTheme, useChartTheme } from "@/styles/charts";
export type { ChartTheme } from "@/styles/charts";
