import type { ReactNode } from "react";

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export interface ChartTooltipPayloadItem {
  dataKey: string | number;
  name: string;
  value: number | string;
  color?: string;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
}

export interface ChartLegendItem {
  label: string;
  color: string;
}
