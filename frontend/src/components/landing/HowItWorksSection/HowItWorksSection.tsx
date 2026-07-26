import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  FileSpreadsheet,
  LayoutDashboard,
} from "lucide-react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: FileSpreadsheet,
    title: "Adicione suas informações",
    description:
      "Cadastre movimentações manualmente ou importe seus dados financeiros por arquivo.",
  },
  {
    number: "02",
    icon: LayoutDashboard,
    title: "Acompanhe seus indicadores",
    description:
      "Visualize saldo, receitas, despesas, categorias, evolução mensal e score financeiro.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Receba análises inteligentes",
    description:
      "O Finance AI identifica padrões e gera recomendações de acordo com seu perfil.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } =
    useScrollReveal<HTMLElement>({
      threshold: 0.12,
    });

  return (
    <section
      ref={ref}
      id="como-funciona"
      className={cn(
        "relative scroll-mt-24",
        "overflow-hidden",
        "border-y border-border-muted",
        "bg-surface/25",
        "px-4 py-20",
        "sm:px-6 sm:py-24",
        "lg:px-8 lg:py-28",
      )}
      aria-labelledby="how-it-works-title"
    >
      <div
        className={cn(
          "pointer-events-none",
          "absolute right-0 top-0",
          "h-96 w-96",
          "translate-x-1/3",
          "-translate-y-1/3",
          "rounded-full",
          "bg-primary/10 blur-[120px]",
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative mx-auto",
          "w-full max-w-7xl",
        )}
      >
        <header
          className={cn(
            "scroll-reveal",
            isVisible &&
              "scroll-reveal--visible",
            "mx-auto max-w-3xl",
            "text-center",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold",
              "uppercase tracking-[0.18em]",
              "text-primary-bright",
            )}
          >
            Como funciona
          </p>

          <h2
            id="how-it-works-title"
            className={cn(
              "mt-4 text-balance",
              "text-3xl font-bold",
              "tracking-[-0.04em]",
              "text-text",
              "sm:text-4xl",
              "lg:text-5xl",
            )}
          >
            Dos seus dados para decisões
            melhores.
          </h2>

          <p
            className={cn(
              "mx-auto mt-5",
              "max-w-2xl",
              "text-base leading-7",
              "text-text-muted",
              "sm:text-lg",
            )}
          >
            Em poucos passos, suas movimentações
            são transformadas em informações
            claras e recomendações práticas.
          </p>
        </header>

        <div
          className={cn(
            "relative mt-14 grid",
            "gap-6",
            "lg:mt-18 lg:grid-cols-3",
          )}
        >
          <div
            className={cn(
              "pointer-events-none",
              "absolute left-[16.5%]",
              "right-[16.5%] top-10",
              "hidden h-px",
              "bg-gradient-to-r",
              "from-transparent",
              "via-border-highlight",
              "to-transparent",
              "lg:block",
            )}
            aria-hidden="true"
          />

          {steps.map(
            (
              {
                number,
                icon: Icon,
                title,
                description,
              },
              index,
            ) => (
              <article
                key={number}
                className={cn(
                  "scroll-reveal",
                  isVisible &&
                    "scroll-reveal--visible",
                  "relative",
                  "rounded-[22px]",
                  "border border-border-muted",
                  "bg-background/70",
                  "p-6 backdrop-blur-xl",
                  "sm:p-8",
                )}
                style={{
                  transitionDelay: `${index * 120}ms`,
                }}
              >
                <div
                  className={cn(
                    "flex items-start",
                    "justify-between gap-4",
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10",
                      "flex size-12",
                      "items-center justify-center",
                      "rounded-2xl",
                      "border border-primary/25",
                      "bg-background",
                      "text-primary-bright",
                      "shadow-[0_0_30px_-16px_var(--glow-primary)]",
                    )}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    className={cn(
                      "text-4xl font-bold",
                      "tracking-[-0.06em]",
                      "text-text-subtle/30",
                    )}
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                </div>

                <h3
                  className={cn(
                    "mt-8 text-xl",
                    "font-semibold",
                    "tracking-[-0.025em]",
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
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}