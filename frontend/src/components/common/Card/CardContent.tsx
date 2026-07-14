import type { CardSectionProps } from "./Card.types";

export function CardContent({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <div
      className={`
        px-6
        py-5
        ${className}
      `}
    >
      {children}
    </div>
  );
}