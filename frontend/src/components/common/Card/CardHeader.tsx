import type { CardSectionProps } from "./Card.types";

export function CardHeader({ children, className = "" }: CardSectionProps) {
  return (
    <header
      className={`
        flex
        items-center
        justify-between
        px-6
        pt-6
        ${className}
      `}
    >
      {children}
    </header>
  );
}
