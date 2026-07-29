/**
 * Shadow scale — mirrors --shadow-card / --shadow-elevated in theme.css.
 * Elevation is intentionally subtle across the whole app (per brief:
 * "sombras discretas"). Avoid adding new shadow values ad hoc — extend
 * theme.css and this file together instead.
 */
export const shadows = {
  card: "shadow-card", // resting state
  elevated: "shadow-elevated", // hover state
  none: "shadow-none",
} as const;
