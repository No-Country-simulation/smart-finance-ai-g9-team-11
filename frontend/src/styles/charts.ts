import { useEffect, useState } from "react";

/**
 * Recharts needs literal color strings (stroke="#4F7CFF"), it can't consume
 * Tailwind classes. To avoid a second, hand-maintained copy of every color
 * that could drift from theme.css, this reads the CSS custom properties
 * directly off <html> at call time — theme.css stays the single source.
 */
export interface ChartTheme {
  line1: string;
  line2: string;
  grid: string;
  tooltipBg: string;
  tooltipText: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  textMuted: string;
}

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function getChartTheme(): ChartTheme {
  return {
    line1: cssVar("--chart-line-1", "#4F7CFF"),
    line2: cssVar("--chart-line-2", "#0F172A"),
    grid: cssVar("--chart-grid", "#EEF0F3"),
    tooltipBg: cssVar("--chart-tooltip-bg", "#0F172A"),
    tooltipText: cssVar("--chart-tooltip-text", "#FFFFFF"),
    primary: cssVar("--primary", "#4F7CFF"),
    success: cssVar("--success", "#22C55E"),
    warning: cssVar("--warning", "#F59E0B"),
    danger: cssVar("--danger", "#EF4444"),
    textMuted: cssVar("--text-muted", "#64748B"),
  };
}

/**
 * Use inside any chart component. Re-reads tokens whenever ThemeProvider
 * toggles the `dark` class on <html>, so Recharts colors always match the
 * active theme without a page reload.
 */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(() => getChartTheme());

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setTheme(getChartTheme());
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return theme;
}
