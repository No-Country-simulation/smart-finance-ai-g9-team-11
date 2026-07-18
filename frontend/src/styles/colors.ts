/**
 * Paleta de referência para consumidores que não conseguem utilizar classes
 * Tailwind ou variáveis CSS diretamente.
 *
 * Componentes React devem continuar utilizando tokens semânticos:
 *
 * bg-background
 * bg-surface
 * bg-surface-elevated
 * bg-card
 * text-text
 * text-text-muted
 * border-border
 *
 * A fonte principal de verdade permanece em src/styles/theme.css.
 */

export const palette = {
  light: {
    background: "#F6F7FB",
    surface: "#FFFFFF",
    surfaceMuted: "#F0F2F7",
    surfaceElevated: "#FFFFFF",
    surfaceAccent: "#EDF1FF",
    surfaceAccent2: "#F2EFFF",
    card: "rgba(255, 255, 255, 0.92)",
    cardHover: "rgba(255, 255, 255, 1)",
    border: "rgba(71, 85, 105, 0.14)",
    borderMuted: "rgba(100, 116, 139, 0.09)",
    borderHighlight: "rgba(124, 58, 237, 0.28)",
    primary: "#7C3AED",
    primaryBright: "#8B5CF6",
    secondary: "#2563EB",
    secondaryBright: "#3B82F6",
    success: "#16A34A",
    warning: "#D97706",
    danger: "#E11D48",
    text: "#111827",
    textMuted: "#64748B",
    textSubtle: "#94A3B8",
    glowPrimary: "rgba(124, 58, 237, 0.16)",
    glowSecondary: "rgba(37, 99, 235, 0.14)",
  },

  dark: {
    background: "#050814",
    surface: "#080D1A",
    surfaceMuted: "#0B1120",
    surfaceElevated: "#10182B",
    surfaceAccent: "rgba(124, 58, 237, 0.10)",
    surfaceAccent2: "rgba(37, 99, 235, 0.10)",
    card: "rgba(13, 20, 38, 0.82)",
    cardHover: "rgba(20, 29, 52, 0.95)",
    border: "rgba(148, 163, 184, 0.12)",
    borderMuted: "rgba(148, 163, 184, 0.07)",
    borderHighlight: "rgba(124, 58, 237, 0.32)",
    primary: "#7C3AED",
    primaryBright: "#8B5CF6",
    secondary: "#2563EB",
    secondaryBright: "#3B82F6",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#F43F5E",
    text: "#F8FAFC",
    textMuted: "#A7B0C3",
    textSubtle: "#6F7A91",
    glowPrimary: "rgba(124, 58, 237, 0.25)",
    glowSecondary: "rgba(37, 99, 235, 0.22)",
  },
} as const;

export type ThemeMode = keyof typeof palette;
export type PaletteToken = keyof typeof palette.light;