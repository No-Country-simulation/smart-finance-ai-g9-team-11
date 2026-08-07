import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface AuthFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  startIcon?: ReactNode;
}

export const AuthField = forwardRef<
  HTMLInputElement,
  AuthFieldProps
>(function AuthField(
  {
    id,
    label,
    error,
    hint,
    startIcon,
    className,
    disabled,
    ...inputProps
  },
  ref,
) {
  const inputId =
    id ?? `auth-field-${inputProps.name ?? "input"}`;

  const descriptionId = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-text"
      >
        {label}
      </label>

      <div className="relative">
        {startIcon ? (
          <div
            className={cn(
              "pointer-events-none",
              "absolute inset-y-0 left-0",
              "flex items-center pl-3.5",
              "text-text-muted",
            )}
            aria-hidden="true"
          >
            {startIcon}
          </div>
        ) : null}

        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={cn(
            "h-12 w-full rounded-xl",
            "border border-border-muted",
            "bg-background/50",
            "px-3.5 text-sm text-text",
            "outline-none",
            "transition-colors",
            "placeholder:text-text-muted/70",
            "hover:border-border-highlight",
            "focus:border-primary-bright",
            "focus:ring-2",
            "focus:ring-primary/20",
            "disabled:cursor-not-allowed",
            "disabled:opacity-60",
            startIcon && "pl-10",
            error &&
              "border-red-500/70 focus:border-red-500 focus:ring-red-500/15",
            className,
          )}
        />
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs leading-5 text-red-400"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="text-xs leading-5 text-text-muted"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});