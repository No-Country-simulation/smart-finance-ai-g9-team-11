/**
 * Type scale — mirrors the --text-* tokens in theme.css, which generate
 * the text-display / text-heading / text-title / text-body / text-caption
 * utilities (font-size + line-height pairs).
 *
 * Usage: pair with a font-weight utility, e.g. `text-display font-semibold`.
 *   display — big KPI numbers (e.g. "721K")
 *   heading — page/section titles
 *   title   — card titles (e.g. "Total Users")
 *   body    — default paragraph/table text
 *   caption — labels, timestamps, legends, muted metadata
 */
export const typography = {
  display: { fontSize: "2.5rem", lineHeight: 1.1, className: "text-display" },
  heading: { fontSize: "1.5rem", lineHeight: 1.25, className: "text-heading" },
  title: { fontSize: "1.125rem", lineHeight: 1.4, className: "text-title" },
  body: { fontSize: "0.9375rem", lineHeight: 1.55, className: "text-body" },
  caption: { fontSize: "0.8125rem", lineHeight: 1.4, className: "text-caption" },
} as const;
