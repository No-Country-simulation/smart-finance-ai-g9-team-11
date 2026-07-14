import type { CardProps } from "./Card.types";

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </section>
  );
}