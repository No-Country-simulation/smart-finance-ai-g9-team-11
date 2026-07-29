import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface CardValueProps {
  label: string;
  value: string;
  /** Percentage change, e.g. 11.01 or -0.03. Renders a colored badge with arrow. */
  delta?: number;
  /** Small icon shown top-right of the label (per brief: "ícones menores") */
  icon?: ReactNode;
}

/**
 * The KPI stat block used inside a <Card>, e.g.:
 *   <Card tone="accent">
 *     <CardContent>
 *       <CardValue label="Views" value="721K" delta={11.01} />
 *     </CardContent>
 *   </Card>
 */
export function CardValue({ label, value, delta, icon }: CardValueProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-muted">{label}</span>
        {icon && (
          <span className="text-text-subtle [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-display font-semibold tracking-tight text-text">
          {value}
        </span>

        {delta !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-caption font-medium ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(delta).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}
