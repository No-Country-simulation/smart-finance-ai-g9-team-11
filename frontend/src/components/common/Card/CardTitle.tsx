import type { CardSectionProps } from "./Card.types";

export function CardTitle({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <h3
      className={`
        text-lg
        font-semibold
        tracking-tight
        text-slate-900
        ${className}
      `}
    >
      {children}
    </h3>
  );
}