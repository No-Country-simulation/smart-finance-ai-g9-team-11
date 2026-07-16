import type { ReactNode } from "react";

export interface ChartContainerProps {
  title: string;

  subtitle?: string;

  children: ReactNode;

  className?: string;
}

export interface ChartTooltipProps {
  active?: boolean;

  payload?: any[];

  label?: string;
}

export interface ChartLegendItem {
  label: string;

  color: string;
}