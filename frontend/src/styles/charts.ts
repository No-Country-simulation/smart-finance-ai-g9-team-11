import { useEffect, useState } from "react";

export interface ChartTheme {
  line1: string;
  line2: string;
  grid: string;
  tooltipBg: string;
  tooltipText: string;
  primary: string;
  primaryBright: string;
  secondary: string;
  secondaryBright: string;
  success: string;
  warning: string;
  danger: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  surface: string;
  surfaceElevated: string;
  border: string;
}

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

export function getChartTheme(): ChartTheme {
  return {
    line1: cssVar("--chart-line-1", "#8B5CF6"),
    line2: cssVar("--chart-line-2", "#3B82F6"),
    grid: cssVar(
      "--chart-grid",
      "rgba(148, 163, 184, 0.09)",
    ),
    tooltipBg: cssVar("--chart-tooltip-bg", "#10182B"),
    tooltipText: cssVar("--chart-tooltip-text", "#F8FAFC"),
    primary: cssVar("--primary", "#7C3AED"),
    primaryBright: cssVar("--primary-bright", "#8B5CF6"),
    secondary: cssVar("--secondary", "#2563EB"),
    secondaryBright: cssVar("--secondary-bright", "#3B82F6"),
    success: cssVar("--success", "#22C55E"),
    warning: cssVar("--warning", "#F59E0B"),
    danger: cssVar("--danger", "#F43F5E"),
    text: cssVar("--text", "#F8FAFC"),
    textMuted: cssVar("--text-muted", "#A7B0C3"),
    textSubtle: cssVar("--text-subtle", "#6F7A91"),
    surface: cssVar("--surface", "#080D1A"),
    surfaceElevated: cssVar("--surface-elevated", "#10182B"),
    border: cssVar(
      "--border",
      "rgba(148, 163, 184, 0.12)",
    ),
  };
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(
    getChartTheme,
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = (): void => {
      setTheme(getChartTheme());
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}