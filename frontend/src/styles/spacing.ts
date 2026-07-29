/**
 * Spacing reference. Tailwind's default 4px-based scale already covers
 * this project — this file documents the subset we use consistently
 * across dashboard components so padding never drifts card to card.
 */
export const spacing = {
  cardPaddingX: "1.5rem", // px-6
  cardPaddingTop: "1.5rem", // pt-6
  cardPaddingY: "1.25rem", // py-5
  sectionGap: "1.5rem", // gap-6 — space between dashboard cards/widgets
  gridGap: "1.25rem", // gap-5 — space inside a card (legend items, stat rows)
} as const;
