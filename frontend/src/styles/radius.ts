/**
 * Radius scale — mirrors the --radius-* tokens in theme.css (Tailwind v4
 * `@theme` namespace), which generate the rounded-sm / rounded-md /
 * rounded-card / rounded-lg / rounded-pill utilities.
 *
 * Cards use rounded-card (18px) everywhere, per the design brief.
 * Don't reach for an arbitrary rounded-[Npx] value in a component —
 * add a token here and in theme.css instead.
 */
export const radius = {
  sm: "8px",
  md: "12px",
  card: "18px",
  lg: "20px",
  pill: "999px",
} as const;
