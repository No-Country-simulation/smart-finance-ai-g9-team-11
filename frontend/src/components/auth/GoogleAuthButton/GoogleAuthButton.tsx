import type {
  ButtonHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface GoogleAuthButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function GoogleAuthButton({
  label = "Continuar com Google",
  className,
  disabled,
  ...buttonProps
}: Readonly<GoogleAuthButtonProps>) {
  return (
    <button
      {...buttonProps}
      type="button"
      disabled={disabled}
      className={cn(
        "flex h-12 w-full",
        "items-center justify-center gap-3",
        "rounded-xl border",
        "border-border-muted",
        "bg-background/40",
        "px-4",
        "text-sm font-semibold",
        "text-text",
        "transition-colors",
        "hover:border-border-highlight",
        "hover:bg-surface-elevated",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary-bright",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center",
          "justify-center",
          "rounded-full",
          "bg-white",
          "text-xs font-bold",
          "text-black",
        )}
        aria-hidden="true"
      >
        G
      </span>

      {label}
    </button>
  );
}