import type { ScoreGaugeProps } from "./ScoreCard.types";

export function ScoreGauge({
  score,
  maxScore,
}: ScoreGaugeProps) {
  const radius = 56;
  const stroke = 10;

  const normalizedRadius = radius - stroke / 2;

  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.min(score / maxScore, 1);

  const strokeDashoffset =
    circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={140}
        height={140}
        className="-rotate-90"
      >
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={70}
          cy={70}
        />

        <circle
          stroke="#2563EB"
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={70}
          cy={70}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-900">
          {score}
        </span>

        <span className="text-sm text-slate-500">
          / {maxScore}
        </span>
      </div>
    </div>
  );
}