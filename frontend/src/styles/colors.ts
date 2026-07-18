/**
 * Reference palette — do NOT import raw hex values into components.
 * Components must always consume tokens via Tailwind utility classes
 * (bg-surface, text-text, border-border, etc.), which read the CSS
 * custom properties defined in src/styles/theme.css.
 *
 * This file exists for non-CSS consumers only (chart fallback colors,
 * canvas/SVG exports, PDF generation). If you change a value here,
 * change it in theme.css too — theme.css is the source of truth.
 */
export const palette = {
  light: {
    background: "#F7F8FA",
    surface: "#FFFFFF",
    surfaceAccent: "#EAF1FF",
    surfaceAccent2: "#EEF0FA",
    border: "#E5E7EB",
    primary: "#4F7CFF",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    text: "#0F172A",
    textMuted: "#64748B",
  },
  dark: {
    background: "#111315",
    surface: "#1B1D20",
    surfaceAccent: "#22314F",
    surfaceAccent2: "#1F2226",
    border: "#2B2F36",
    primary: "#7EA1FF",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    text: "#F3F4F6",
    textMuted: "#9CA3AF",
  },
} as const;

export type ThemeMode = keyof typeof palette;
export type PaletteToken = keyof typeof palette.light;
