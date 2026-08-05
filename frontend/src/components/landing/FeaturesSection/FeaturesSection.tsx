import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  BrainCircuit,
  ChartPie,
  ListChecks,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ChartPie,
    title: "Categorias de despesas",
    description:
      "Entenda para onde seu dinheiro está indo com uma distribuição visual dos gastos.",
  },
  {
    icon: ScanSearch,
    title: "Perfil financeiro",
    description:
      "Acompanhe seu nível de saúde financeira e os indicadores que influenciam sua classificação.",
  },
  {
    icon: BrainCircuit,
    title: "Recomendações com IA",
    description:
      "Receba sugestões personalizadas com base no seu comportamento e nas suas movimentações.",
  },
  {
    icon: BellRing,
    title: "Alertas inteligentes",
    description:
      "Identifique riscos, gastos elevados e situações que merecem atenção.",
  },
  {
    icon: ListChecks,
    title: "Organização de transações",
    description:
      "Mantenha receitas e despesas centralizadas, classificadas e fáceis de consultar.",
  },
  {
    icon: ShieldCheck,
    title: "Análise estruturada",
    description:
      "Visualize resultados claros e confiáveis por meio de indicadores financeiros organizados.",
  },
];

export function FeaturesSection() {
  const { ref, isVisible } =
    useScrollReveal<HTMLElement>({
      threshold: 0.08,
    });

  return (
    <section
      ref={ref}
      id="recursos"
      className={cn(
        "relative scroll-mt-24",
        "px-4 py-20",
        "sm:px-6 sm:py-24",
        "lg:px-8 lg:py-28",
      )}
      aria-labelledby="features-title"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={cn(
            "grid gap-12",
            // ALTERADO: A coluna maior (1.2fr) agora vem na esquerda e a menor (0.8fr) na direita
            "lg:grid-cols-[1.2fr_0.8fr]",
            "lg:items-start lg:gap-16",
          )}
        >
          {/* MUDANÇA DE POSIÇÃO: O grid de cards passou para a esquerda (agora é o 1º elemento) */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(
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
                    "group min-h-[220px]",
                    "rounded-[22px]",
                    "border border-border-muted",
                    "bg-surface/35 p-6",
                    "transition-[transform,border-color,background-color]",
                    "duration-300",
                    "hover:-translate-y-1",
                    "hover:border-border-highlight",
                    "hover:bg-surface/65",
                    "motion-reduce:transition-none",
                  )}
                  style={{
                    transitionDelay: `${index * 80}ms`,
                  }}
                >
                  <Icon
                    size={23}
                    strokeWidth={1.8}
                    className={cn(
                      "text-primary-bright",
                      "transition-transform",
                      "duration-300",
                      "group-hover:scale-110",
                      "motion-reduce:transition-none",
                    )}
                    aria-hidden="true"
                  />

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
                </article>
              ),
            )}
          </div>

          {/* MUDANÇA DE POSIÇÃO: O cabeçalho foi para a direita (agora é o 2º elemento) */}
          <header
            className={cn(
              "scroll-reveal",
              isVisible &&
                "scroll-reveal--visible",
              "lg:sticky lg:top-28",
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold",
                "uppercase tracking-[0.18em]",
                "text-primary-bright",
              )}
            >
              Recursos do produto
            </p>

            <h2
              id="features-title"
              className={cn(
                "mt-4 text-balance",
                "text-3xl font-bold",
                "tracking-[-0.04em]",
                "text-text",
                "sm:text-4xl",
                "lg:text-5xl",
              )}
            >
              Tudo que você precisa para
              entender sua vida financeira.
            </h2>

            <p
              className={cn(
                "mt-5 max-w-xl",
                "text-base leading-7",
                "text-text-muted",
                "sm:text-lg",
              )}
            >
              Uma experiência criada para
              organizar informações, destacar
              riscos e apresentar ações que
              realmente façam sentido.
            </p>

            <div
              className={cn(
                "mt-8 rounded-[20px]",
                "border border-primary/15",
                "bg-primary/5 p-5",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold",
                  "text-text",
                )}
              >
                Inteligência aplicada ao dia a
                dia
              </p>

              <p
                className={cn(
                  "mt-2 text-sm",
                  "leading-6",
                  "text-text-muted",
                )}
              >
                O objetivo não é apenas mostrar
                números, mas ajudar o usuário a
                interpretar o que eles
                representam.
              </p>
            </div>
          </header>
        </div>
      </div>
    </section>
  );
}