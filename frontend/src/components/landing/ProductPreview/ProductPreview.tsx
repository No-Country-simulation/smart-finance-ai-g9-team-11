import {
  Activity,
  BrainCircuit,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function ProductPreview() {
  const {
    ref,
    isVisible,
  } = useScrollReveal<HTMLDivElement>({
    threshold: 0.12,
  });

  const previewRef =
    useRef<HTMLDivElement>(null);

  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    const element = previewRef.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let frameId = 0;

    const updateParallax = (): void => {
      const rect =
        element.getBoundingClientRect();

      const viewportCenter =
        window.innerHeight / 2;

      const elementCenter =
        rect.top + rect.height / 2;

      const distance =
        elementCenter - viewportCenter;

      const offset = Math.max(
        -18,
        Math.min(18, distance * -0.025),
      );

      element.style.setProperty(
        "--preview-parallax",
        `${offset}px`,
      );
    };

    const handleScroll = (): void => {
      window.cancelAnimationFrame(frameId);

      frameId =
        window.requestAnimationFrame(
          updateParallax,
        );
    };

    updateParallax();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.cancelAnimationFrame(frameId);

      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal",
        isVisible &&
          "scroll-reveal--visible",
      )}
    >
      <div
        ref={previewRef}
        className={cn(
          "relative mx-auto",
          "w-full max-w-6xl",
          "translate-y-[var(--preview-parallax,0px)]",
          "transition-transform duration-100",
          "motion-reduce:transform-none",
          "motion-reduce:transition-none",
        )}
      >
        <div
          className={cn(
            "pointer-events-none",
            "absolute -inset-16",
            "bg-[radial-gradient(circle_at_center,var(--glow-primary),transparent_68%)]",
            "opacity-45 blur-3xl",
          )}
          aria-hidden="true"
        />

        <div
          className={cn(
            "relative overflow-hidden",
            "rounded-[24px]",
            "border border-border-highlight/70",
            "bg-surface/85 p-1.5",
            "shadow-[0_35px_100px_-45px_rgba(0,0,0,0.9)]",
            "backdrop-blur-xl",
            "sm:rounded-[30px] sm:p-2",
          )}
        >
          <div
            className={cn(
              "flex min-h-11 items-center",
              "justify-between gap-3",
              "border-b border-border-muted",
              "px-3 sm:px-4",
            )}
          >
            <div
              className="flex items-center gap-1.5"
              aria-hidden="true"
            >
              <span className="size-2.5 rounded-full bg-danger/75" />
              <span className="size-2.5 rounded-full bg-warning/75" />
              <span className="size-2.5 rounded-full bg-success/75" />
            </div>

            <div
              className={cn(
                "rounded-lg border",
                "border-border-muted",
                "bg-background/65",
                "px-3 py-1",
                "text-[9px] font-medium",
                "text-text-subtle",
              )}
            >
              app.finance-ai.com/dashboard
            </div>

            <div className="w-10" />
          </div>

          <div
            className={cn(
              "relative aspect-[16/9]",
              "min-h-[230px]",
              "overflow-hidden",
              "rounded-b-[20px]",
              "bg-background",
            )}
          >
            {!imageError ? (
              <img
                src="/dashboard-preview.png"
                alt="Dashboard do Finance AI mostrando indicadores, gráficos e recomendações financeiras"
                className={cn(
                  "h-full w-full",
                  "object-cover object-top",
                )}
                onError={() =>
                  setImageError(true)
                }
              />
            ) : (
              <div
                className={cn(
                  "flex h-full min-h-[360px]",
                  "flex-col items-center",
                  "justify-center",
                  "bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_65%)]",
                  "px-6 text-center",
                )}
              >
                <div
                  className={cn(
                    "flex size-16",
                    "items-center justify-center",
                    "rounded-[22px]",
                    "border border-primary/25",
                    "bg-primary/10",
                    "text-primary-bright",
                  )}
                >
                  <BrainCircuit
                    size={30}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className={cn(
                    "mt-5 text-lg",
                    "font-semibold text-text",
                  )}
                >
                  Preview do Finance AI
                </p>

                <p
                  className={cn(
                    "mt-2 max-w-md",
                    "text-sm leading-6",
                    "text-text-muted",
                  )}
                >
                  Adicione a captura do Dashboard
                  em{" "}
                  <strong className="text-text">
                    public/dashboard-preview.png
                  </strong>
                  .
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "absolute -left-3 top-[24%]",
            "hidden items-center gap-3",
            "rounded-2xl border",
            "border-border-highlight/60",
            "bg-surface/90 p-3",
            "shadow-elevated",
            "backdrop-blur-xl",
            "lg:flex",
          )}
        >
          <span
            className={cn(
              "flex size-9 items-center",
              "justify-center rounded-xl",
              "bg-success/10 text-success",
            )}
          >
            <ShieldCheck
              size={17}
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-[10px] text-text-subtle">
              Saúde financeira
            </p>

            <p className="mt-0.5 text-xs font-semibold text-text">
              Perfil saudável
            </p>
          </div>
        </div>

        <div
          className={cn(
            "absolute -right-3 bottom-[18%]",
            "hidden items-center gap-3",
            "rounded-2xl border",
            "border-border-highlight/60",
            "bg-surface/90 p-3",
            "shadow-elevated",
            "backdrop-blur-xl",
            "lg:flex",
          )}
        >
          <span
            className={cn(
              "flex size-9 items-center",
              "justify-center rounded-xl",
              "bg-primary/10",
              "text-primary-bright",
            )}
          >
            <ChartNoAxesCombined
              size={17}
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-[10px] text-text-subtle">
              Análise inteligente
            </p>

            <p className="mt-0.5 text-xs font-semibold text-text">
              Atualizada agora
            </p>
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-4 left-1/2",
            "hidden -translate-x-1/2",
            "items-center gap-2",
            "rounded-full border",
            "border-border-highlight/60",
            "bg-background/80",
            "px-3 py-1.5",
            "text-[10px] font-medium",
            "text-text-muted",
            "backdrop-blur-xl",
            "md:flex",
          )}
        >
          <Activity
            size={12}
            className="text-success"
            aria-hidden="true"
          />

          Dados financeiros organizados em uma
          única visão
        </div>
      </div>
    </div>
  );
}