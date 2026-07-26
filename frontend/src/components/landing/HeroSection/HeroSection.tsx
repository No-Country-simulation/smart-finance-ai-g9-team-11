import {
  ArrowRight,
  BadgeCheck,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

import { ProductPreview } from "../ProductPreview";

export function HeroSection() {
  const {
    ref,
    isVisible,
  } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "0px",
  });

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        "px-4 pb-24 pt-32",
        "sm:px-6 sm:pt-40",
        "lg:px-8 lg:pb-32",
      )}
    >
      <div
        className={cn(
          "pointer-events-none",
          "absolute inset-x-0 top-0",
          "h-[650px]",
          "bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_68%)]",
          "opacity-45",
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "pointer-events-none",
          "absolute left-1/2 top-28",
          "h-72 w-72",
          "-translate-x-1/2",
          "rounded-full",
          "bg-primary/15 blur-[110px]",
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative mx-auto",
          "w-full max-w-7xl",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-4xl",
            "text-center",
          )}
        >
          <div
            className={cn(
              "scroll-reveal",
              isVisible &&
                "scroll-reveal--visible",
            )}
          >
            <div
              className={cn(
                "mx-auto inline-flex",
                "items-center gap-2",
                "rounded-full border",
                "border-primary/20",
                "bg-primary/8",
                "px-3 py-1.5",
                "text-[11px] font-semibold",
                "text-primary-bright",
                "backdrop-blur-xl",
              )}
            >
              <Sparkles
                size={13}
                aria-hidden="true"
              />

              Inteligência financeira ao seu
              alcance
            </div>
          </div>

          <h1
            className={cn(
              "scroll-reveal",
              isVisible &&
                "scroll-reveal--visible",
              "mx-auto mt-7",
              "max-w-4xl",
              "text-balance",
              "text-4xl font-bold",
              "leading-[1.04]",
              "tracking-[-0.055em]",
              "text-text",
              "sm:text-5xl",
              "lg:text-7xl",
            )}
            style={{
              transitionDelay: "90ms",
            }}
          >
            Transforme seus dados em{" "}
            <span
              className={cn(
                "bg-gradient-to-r",
                "from-primary-bright",
                "via-secondary-bright",
                "to-success",
                "bg-clip-text text-transparent",
              )}
            >
              decisões financeiras
            </span>{" "}
            mais inteligentes.
          </h1>

          <p
            className={cn(
              "scroll-reveal",
              isVisible &&
                "scroll-reveal--visible",
              "mx-auto mt-6",
              "max-w-2xl",
              "text-pretty",
              "text-base leading-7",
              "text-text-muted",
              "sm:text-lg sm:leading-8",
            )}
            style={{
              transitionDelay: "180ms",
            }}
          >
            Organize suas transações, acompanhe
            sua saúde financeira e receba
            recomendações personalizadas com
            inteligência artificial.
          </p>

          <div
            className={cn(
              "scroll-reveal",
              isVisible &&
                "scroll-reveal--visible",
              "mt-8 flex flex-col",
              "items-center justify-center",
              "gap-3 sm:flex-row",
            )}
            style={{
              transitionDelay: "270ms",
            }}
          >
            <Link
              to="/register"
              className={cn(
                "inline-flex h-12",
                "w-full items-center",
                "justify-center gap-2",
                "rounded-[14px]",
                "bg-primary px-6",
                "text-sm font-semibold",
                "text-primary-foreground",
                "shadow-[0_20px_55px_-22px_var(--glow-primary)]",
                "transition-[transform,opacity]",
                "hover:-translate-y-0.5",
                "hover:opacity-95",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",
                "motion-reduce:transition-none",
                "sm:w-auto",
              )}
            >
              Começar gratuitamente

              <ArrowRight
                size={16}
                aria-hidden="true"
              />
            </Link>

            <a
              href="#recursos"
              className={cn(
                "inline-flex h-12",
                "w-full items-center",
                "justify-center gap-2",
                "rounded-[14px] border",
                "border-border",
                "bg-surface-elevated/60",
                "px-6",
                "text-sm font-semibold",
                "text-text",
                "backdrop-blur-xl",
                "transition-colors",
                "hover:border-border-highlight",
                "hover:bg-surface-elevated",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary",
                "sm:w-auto",
              )}
            >
              <Play
                size={15}
                aria-hidden="true"
              />

              Conhecer o projeto
            </a>
          </div>

          <div
            className={cn(
              "scroll-reveal",
              isVisible &&
                "scroll-reveal--visible",
              "mt-6 flex flex-wrap",
              "items-center justify-center",
              "gap-x-5 gap-y-2",
              "text-[11px]",
              "text-text-subtle",
            )}
            style={{
              transitionDelay: "360ms",
            }}
          >
            {[
              "Análise automatizada",
              "Recomendações com IA",
              "Visualização intuitiva",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5"
              >
                <BadgeCheck
                  size={13}
                  className="text-success"
                  aria-hidden="true"
                />

                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}