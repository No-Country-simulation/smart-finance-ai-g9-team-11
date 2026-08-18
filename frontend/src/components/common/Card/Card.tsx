import { cn } from "@/lib/utils";

import type {
  CardProps,
  CardTone,
} from "./Card.types";

const toneClass: Record<CardTone, string> = {
  default: "bg-surface",
  accent: "bg-surface-accent",
  "accent-2": "bg-surface-accent-2",
};

export function Card({
  children,
  className,
  tone = "default",
}: Readonly<CardProps>) {
  return (
    <section
      className={cn(
        "rounded-card border border-border",
        "shadow-card",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}