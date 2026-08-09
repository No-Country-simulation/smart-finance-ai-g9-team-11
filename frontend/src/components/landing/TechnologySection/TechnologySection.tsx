import {
  Bot,
  Boxes,
  Braces,
  Cloud,
  Container,
  Database,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const technologies = [
  {
    name: "React",
    description:
      "Interface moderna, responsiva e componentizada.",
    icon: Braces,
  },
  {
    name: "TypeScript",
    description:
      "Tipagem segura e maior confiabilidade no frontend.",
    icon: ShieldCheck,
  },
  {
    name: "Spring Boot",
    description:
      "API REST e regras de negócio da aplicação.",
    icon: ServerCog,
  },
  {
    name: "Machine Learning",
    description:
      "Classificação e geração de análises inteligentes.",
    icon: Bot,
  },
  {
    name: "PostgreSQL",
    description:
      "Persistência estruturada dos dados financeiros.",
    icon: Database,
  },
  {
    name: "Docker",
    description:
      "Padronização dos ambientes e dos serviços.",
    icon: Container,
  },
  {
    name: "Oracle Cloud",
    description:
      "Infraestrutura e serviços em nuvem do projeto.",
    icon: Cloud,
  },
  {
    name: "Arquitetura modular",
    description:
      "Separação entre frontend, backend, dados e IA.",
    icon: Boxes,
  },
];

export function TechnologySection() {
  const {
    ref,
    isVisible,
  } = useScrollReveal<HTMLElement>({
    threshold: 0.08,
  });

  return (
    <section
      ref={ref}
      id="tecnologias"
      className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={cn(
            "scroll-reveal mx-auto max-w-3xl text-center",
            isVisible && "scroll-reveal--visible",
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-bright">
            Tecnologias
          </span>

          <h2 className="mt-4 text-balance text-3xl font-bold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
            Uma arquitetura preparada para evoluir
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-7 text-text-muted sm:text-base">
            O Finance AI combina desenvolvimento web,
            inteligência artificial, banco de dados e
            infraestrutura em nuvem em uma solução
            integrada.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map(
            (
              {
                name,
                description,
                icon: Icon,
              },
              index,
            ) => (
              <article
                key={name}
                className={cn(
                  "scroll-reveal",
                  isVisible &&
                    "scroll-reveal--visible",
                  "group rounded-[20px] border",
                  "border-border-muted",
                  "bg-surface/70 p-5",
                  "backdrop-blur-xl",
                  "transition-[transform,border-color,background-color]",
                  "hover:-translate-y-1",
                  "hover:border-primary/25",
                  "hover:bg-surface-elevated/80",
                )}
                style={{
                  transitionDelay: `${index * 60}ms`,
                }}
              >
                <div
                  className={cn(
                    "flex size-11 items-center",
                    "justify-center rounded-[14px]",
                    "border border-primary/15",
                    "bg-primary/10",
                    "text-primary-bright",
                  )}
                >
                  <Icon
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-text">
                  {name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-text-muted">
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