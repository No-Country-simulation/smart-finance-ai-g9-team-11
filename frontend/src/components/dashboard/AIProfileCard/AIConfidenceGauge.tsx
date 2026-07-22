import { useId } from "react";

import { cn } from "@/lib/utils";

import type { AIConfidenceGaugeProps } from "./AIProfileCard.types";

export function AIConfidenceGauge({
  value,
  size = 92,
}: Readonly<AIConfidenceGaugeProps>) {
  const gradientId = useId().replaceAll(":", "");

  const safeValue = Math.min(
    Math.max(value, 0),
    100,
  );

  const strokeWidth = 8;
  const radius =
    size / 2 - strokeWidth;

  const circumference =
    2 * Math.PI * radius;

  const strokeDashoffset =
    circumference *
    (1 - safeValue / 100);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
      role="img"
      aria-label={`Confiança da IA: ${safeValue}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${gradientId}-gauge`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#7c3aed"
            />

            <stop
              offset="55%"
              stopColor="#3b82f6"
            />

            <stop
              offset="100%"
              stopColor="#10b981"
            />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--border-muted)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${gradientId}-gauge)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-[stroke-dashoffset]",
            "duration-700 ease-out",
          )}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums text-text">
          {safeValue}%
        </span>

        <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.08em] text-text-subtle">
          confiança
        </span>
      </div>
    </div>
  );
}