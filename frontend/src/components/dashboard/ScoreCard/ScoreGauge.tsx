import type { ScoreGaugeProps } from "./ScoreCard.types";

export function ScoreGauge({
  score,
  maxScore,
}: Readonly<ScoreGaugeProps>) {
  const size = 112;
  const center = size / 2;
  const radius = 43;
  const strokeWidth = 9;

  const circumference =
    2 * Math.PI * radius;

  const safeMaxScore = Math.max(maxScore, 1);

  const progress = Math.min(
    Math.max(score / safeMaxScore, 0),
    1,
  );

  const strokeDashoffset =
    circumference * (1 - progress);

  return (
    <div
      className="relative flex size-28 shrink-0 items-center justify-center"
      aria-label={`Pontuação financeira: ${score} de ${maxScore}`}
      role="img"
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
            id="score-gauge-gradient"
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
              offset="52%"
              stopColor="#2563eb"
            />

            <stop
              offset="100%"
              stopColor="#38bdf8"
            />
          </linearGradient>

          <filter
            id="score-gauge-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="2.5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border-muted"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="url(#score-gauge-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#score-gauge-glow)"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tracking-[-0.04em] text-text">
          {score}
        </span>

        <span className="mt-0.5 text-[10px] font-medium text-text-muted">
          / {maxScore}
        </span>
      </div>
    </div>
  );
}