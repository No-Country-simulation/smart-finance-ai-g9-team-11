import type { CardSectionProps } from "./Card.types";

export function CardFooter({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <footer
      className={`
        border-t
        border-slate-100
        px-6
        py-4
        ${className}
      `}
    >
      {children}
    </footer>
  );
}