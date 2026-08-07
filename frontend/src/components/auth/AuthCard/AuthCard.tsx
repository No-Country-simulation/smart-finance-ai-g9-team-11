import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({
  children,
  className,
}: Readonly<AuthCardProps>) {
  return (
    <section
      className={cn(
        "relative w-full max-w-md",
        "rounded-[24px] border",
        "border-border-highlight/60",
        "bg-surface/85 p-6",
        "shadow-elevated",
        "backdrop-blur-xl",
        "sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}