import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function LandingCTA() {
  const {
    ref,
    isVisible,
  } = useScrollReveal<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div
        className={cn(
          "scroll-reveal",
          isVisible &&
            "scroll-reveal--visible",
          "relative mx-auto",
          "w-full max-w-6xl",
          "overflow-hidden",
          "rounded-[28px] border",
          "border-primary/25",
          "bg-gradient-to-br",
          "from-primary/15",
          "via-surface/85",
          "to-secondary/10",
          "px-6 py-14",
          "text-center",
          "shadow-[0_35px_100px_-55px_var(--glow-primary)]",
          "sm:px-10 sm:py-20",
        )}
      >
        <div
          className={cn(
            "mx-auto flex size-12",
            "items-center justify-center",
            "rounded-[16px]",
            "border border-primary/20",
            "bg-primary/10",
            "text-primary-bright",
          )}
        >
          <Sparkles
            size={21}
            aria-hidden="true"
          />
        </div>

        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold tracking-[-0.045em] text-text sm:text-4xl lg:text-5xl">
          Transforme seus dados financeiros em decisões mais inteligentes
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-7 text-text-muted sm:text-base">
          Conheça a experiência completa do
          Finance AI e acompanhe sua saúde
          financeira com mais clareza.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              "transition-[transform,opacity]",
              "hover:-translate-y-0.5",
              "hover:opacity-95",
              "sm:w-auto",
            )}
          >
            Criar minha conta

            <ArrowRight
              size={16}
              aria-hidden="true"
            />
          </Link>

          <Link
            to="/login"
            className={cn(
              "inline-flex h-12",
              "w-full items-center",
              "justify-center",
              "rounded-[14px] border",
              "border-border",
              "bg-background/40 px-6",
              "text-sm font-semibold",
              "text-text",
              "transition-colors",
              "hover:border-primary/30",
              "hover:bg-primary/10",
              "sm:w-auto",
            )}
          >
            Acessar plataforma
          </Link>
        </div>
      </div>
    </section>
  );
}