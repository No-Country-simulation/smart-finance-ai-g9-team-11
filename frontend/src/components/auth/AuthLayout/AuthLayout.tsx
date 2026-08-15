import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

export function AuthLayout({
  children,
  backTo = "/",
  backLabel = "Voltar",
  className,
}: Readonly<AuthLayoutProps>) {
  return (
    <main
      className={cn(
        "relative flex min-h-dvh",
        "items-center justify-center",
        "overflow-hidden",
        "bg-background px-4 py-10",
        "text-text",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none",
          "absolute inset-0",
          "bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_65%)]",
          "opacity-45",
        )}
        aria-hidden="true"
      />

      <Link
        to={backTo}
        className={cn(
          "absolute left-4 top-4 z-10",
          "inline-flex items-center gap-2",
          "rounded-xl px-3 py-2",
          "text-sm font-medium",
          "text-text-muted",
          "transition-colors",
          "hover:bg-surface-elevated",
          "hover:text-text",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary-bright",
          "sm:left-6 sm:top-6",
        )}
      >
        <ArrowLeft
          size={16}
          aria-hidden="true"
        />

        {backLabel}
      </Link>

      {children}
    </main>
  );
}