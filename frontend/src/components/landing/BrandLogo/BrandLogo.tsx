import {
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
  to?: string;
}

export function BrandLogo({
  compact = false,
  className,
  to = "/",
}: Readonly<BrandLogoProps>) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex min-w-0",
        "items-center gap-2.5", // Gap levemente reduzido para mais coesão
        "rounded-xl",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Finance AI — página inicial"
    >
      <span
        className={cn(
          "relative flex size-10 shrink-0",
          "items-center justify-center",
          "rounded-full",
          // MUDANÇA: Borda mais sutil e neutra
          "border border-border", 
          // MUDANÇA: Removido gradiente complexo, adicionado fundo sólido e neutro
          "bg-muted/50", 
          // MUDANÇA: Cor do ícone base, não a "bright"
          "text-primary", 
          // MUDANÇA: REMOVIDO O SHADOW DE GLOW
          // "shadow-[0_0_26px_-10px_var(--glow-primary)]", 
          "transition-all duration-300",
          // MUDANÇA: Feedback visual no hover mais sóbrio (muda o fundo)
          "group-hover:bg-muted",
          "group-hover:border-primary/20",
          "motion-reduce:transition-none",
        )}
        aria-hidden="true"
      >
        <BrainCircuit
          size={22}
          strokeWidth={2.1}
          // MUDANÇA: Ícone principal levemente mais opaco para transparência
          className="opacity-90"
        />

        <Sparkles
          size={9}
          className={cn(
            "absolute right-1 top-1",
            // MUDANÇA: Cor neutra para os sparkles, para que pareçam detalhes técnicos e não "mágica"
            "text-muted-foreground", 
          )}
        />
      </span>

      {!compact && (
        <span className="min-w-0">
          <span
            className={cn(
              "block truncate",
              // MUDANÇA: Fonte semibold em vez de bold e tamanho base
              "text-base font-semibold", 
              // MUDANÇA: Tracking neutro
              "tracking-normal", 
              "text-foreground", // Cor de texto padrão
            )}
          >
            FINANCE AI
          </span>

          {/*
          <span
            className={cn(
              "mt-0.5 block truncate",
              "text-[9px] font-semibold",
              "uppercase tracking-[0.15em]",
              "text-text-subtle",
            )}
          >
            Inteligência financeira
          </span>
           */}
        </span>
      )}
    </Link>
  );
}