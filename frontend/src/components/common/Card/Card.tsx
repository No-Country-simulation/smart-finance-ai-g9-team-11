import type { CardProps, CardTone } from "./Card.types";

const toneClass: Record<CardTone, string> = {
  default: "bg-surface",
  accent: "bg-surface-accent",
  "accent-2": "bg-surface-accent-2",
};

export function Card({ children, className = "", tone = "default" }: CardProps) {
  return (
    <section
      className={`
        rounded-card
        border
        border-border
        ${toneClass[tone]}
        shadow-card
        transition-all
        duration-200
        ease-out
        hover:-translate-y-0.5
        hover:shadow-elevated
        ${className}
      `}
    >
      {children}
    </section>
  );
}
