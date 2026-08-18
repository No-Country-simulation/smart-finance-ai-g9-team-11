import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  ChartNoAxesCombined,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: CircleDollarSign,
    title: "Entenda seus gastos",
    description:
      "Visualize receitas, despesas e categorias em uma interface simples e organizada.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Acompanhe sua evolução",
    description:
      "Compare períodos e identifique mudanças no seu comportamento financeiro.",
  },
  {
    icon: ShieldCheck,
    title: "Antecipe riscos",
    description:
      "Receba alertas sobre endividamento, desequilíbrios e gastos que merecem atenção.",
  },
  {
    icon: BrainCircuit,
    title: "Decida com inteligência",
    description:
      "Transforme seus dados em recomendações personalizadas com apoio da inteligência artificial.",
  },
];

export function BenefitsSection() {
  const { ref, isVisible } =
    useScrollReveal<HTMLElement>({
      threshold: 0.12,
    });

  return (
    <section
      ref={ref}
      id="beneficios"
      className={cn(
        "relative scroll-mt-24",
        "px-4 py-20",
        "sm:px-6 sm:py-24",
        "lg:px-8 lg:py-28",
      )}
      aria-labelledby="benefits-title"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header
          className={cn(
            "scroll-reveal",
            isVisible &&
              "scroll-reveal--visible",
            "max-w-2xl",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold",
              "uppercase tracking-[0.18em]",
              "text-primary-bright",
            )}
          >
            Mais clareza, menos incerteza
          </p>

          <h2
            id="benefits-title"
            className={cn(
              "mt-4 text-balance",
              "text-3xl font-bold",
              "tracking-[-0.04em]",
              "text-text",
              "sm:text-4xl",
              "lg:text-5xl",
            )}
          >
            Suas finanças organizadas em uma
            visão simples.
          </h2>

          <p
            className={cn(
              "mt-5 max-w-xl",
              "text-base leading-7",
              "text-text-muted",
              "sm:text-lg",
            )}
          >
            O Finance AI reúne informações
            importantes para ajudar você a
            entender sua situação financeira e
            agir com mais segurança.
          </p>
        </header>

        <div
          className={cn(
            "mt-12 grid gap-px",
            "overflow-hidden rounded-[24px]",
            "border border-border-muted",
            "bg-border-muted",
            "sm:grid-cols-2",
            "lg:mt-16 lg:grid-cols-4",
          )}
        >
          {benefits.map(
            (
              {
                icon: Icon,
                title,
                description,
              },
              index,
            ) => (
              <article
                key={title}
                className={cn(
                  "scroll-reveal",
                  isVisible &&
                    "scroll-reveal--visible",
                  "group relative",
                  "min-h-[260px]",
                  "bg-background/90",
                  "p-6",
                  "transition-colors",
                  "hover:bg-surface/75",
                  "sm:p-7",
                )}
                style={{
                  transitionDelay: `${index * 90}ms`,
                }}
              >
                <div
                  className={cn(
                    "flex size-11",
                    "items-center justify-center",
                    "rounded-2xl",
                    "border border-primary/20",
                    "bg-primary/8",
                    "text-primary-bright",
                    "transition-transform",
                    "duration-300",
                    "group-hover:-translate-y-1",
                    "motion-reduce:transition-none",
                  )}
                >
                  <Icon
                    size={21}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <h3
                  className={cn(
                    "mt-8 text-lg",
                    "font-semibold",
                    "tracking-[-0.02em]",
                    "text-text",
                  )}
                >
                  {title}
                </h3>

                <p
                  className={cn(
                    "mt-3 text-sm",
                    "leading-6",
                    "text-text-muted",
                  )}
                >
                  {description}
                </p>

                <span
                  className={cn(
                    "absolute inset-x-6",
                    "bottom-0 h-px",
                    "origin-left scale-x-0",
                    "bg-gradient-to-r",
                    "from-primary",
                    "to-transparent",
                    "transition-transform",
                    "duration-300",
                    "group-hover:scale-x-100",
                  )}
                  aria-hidden="true"
                />
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}