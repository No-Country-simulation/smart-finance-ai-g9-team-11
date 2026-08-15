import { cn } from "@/lib/utils";

interface AuthDividerProps {
  label?: string;
  className?: string;
}

export function AuthDivider({
  label = "ou",
  className,
}: Readonly<AuthDividerProps>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        className,
      )}
      role="separator"
      aria-label={label}
    >
      <div className="h-px flex-1 bg-border-muted" />

      <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
        {label}
      </span>

      <div className="h-px flex-1 bg-border-muted" />
    </div>
  );
}