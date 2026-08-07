import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface PasswordFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label?: string;
  error?: string;
  hint?: string;
}

export const PasswordField = forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(function PasswordField(
  {
    id,
    label = "Senha",
    error,
    hint,
    className,
    disabled,
    ...inputProps
  },
  ref,
) {
  const [isVisible, setIsVisible] =
    useState(false);

  const inputId =
    id ?? `password-${inputProps.name ?? "input"}`;

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
        <div
          className={cn(
            "pointer-events-none",
            "absolute inset-y-0 left-0",
            "flex items-center pl-3.5",
            "text-text-muted",
          )}
          aria-hidden="true"
        >
          <LockKeyhole size={17} />
        </div>

        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={cn(
            "h-12 w-full rounded-xl",
            "border border-border-muted",
            "bg-background/50",
            "pl-10 pr-11",
            "text-sm text-text",
            "outline-none",
            "transition-colors",
            "placeholder:text-text-muted/70",
            "hover:border-border-highlight",
            "focus:border-primary-bright",
            "focus:ring-2",
            "focus:ring-primary/20",
            "disabled:cursor-not-allowed",
            "disabled:opacity-60",
            error &&
              "border-red-500/70 focus:border-red-500 focus:ring-red-500/15",
            className,
          )}
        />

        <button
          type="button"
          onClick={() => {
            setIsVisible((current) => !current);
          }}
          disabled={disabled}
          className={cn(
            "absolute inset-y-0 right-0",
            "flex w-11 items-center",
            "justify-center",
            "rounded-r-xl",
            "text-text-muted",
            "transition-colors",
            "hover:text-text",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-inset",
            "focus-visible:ring-primary-bright",
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",
          )}
          aria-label={
            isVisible
              ? "Ocultar senha"
              : "Mostrar senha"
          }
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff
              size={18}
              aria-hidden="true"
            />
          ) : (
            <Eye
              size={18}
              aria-hidden="true"
            />
          )}
        </button>
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