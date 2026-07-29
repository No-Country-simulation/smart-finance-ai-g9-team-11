import type { CardSectionProps } from "./Card.types";

export function CardTitle({ children, className = "" }: CardSectionProps) {
  return (
    <h3
      className={`
        text-title
        font-semibold
        tracking-tight
        text-text
        ${className}
      `}
    >
      {children}
    </h3>
  );
}
