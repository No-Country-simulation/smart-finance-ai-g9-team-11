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
        "items-center gap-3",
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
          "border border-primary/30",
          "bg-gradient-to-br",
          "from-primary/30",
          "via-primary/15",
          "to-secondary/20",
          "text-primary-bright",
          "shadow-[0_0_26px_-10px_var(--glow-primary)]",
          "transition-transform duration-300",
          "group-hover:scale-105",
          "motion-reduce:transition-none",
        )}
        aria-hidden="true"
      >
        <BrainCircuit
          size={22}
          strokeWidth={2.1}
        />

        <Sparkles
          size={9}
          className={cn(
            "absolute right-1 top-1",
            "text-secondary-bright",
          )}
        />
      </span>

      {!compact && (
        <span className="min-w-0">
          <span
            className={cn(
              "block truncate",
              "text-sm font-bold",
              "tracking-[-0.02em]",
              "text-text",
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