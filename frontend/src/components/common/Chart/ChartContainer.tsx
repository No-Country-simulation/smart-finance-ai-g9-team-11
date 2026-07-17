import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import type { ChartContainerProps } from "./Chart.types";

export function ChartContainer({
  title,
  subtitle,
  children,
  className = "",
}: ChartContainerProps) {
  return (
    <Card className={className}>
      <CardHeader className="items-start">
        <div>
          <CardTitle>{title}</CardTitle>

          {subtitle && (
            <p className="mt-1 text-caption text-text-muted">{subtitle}</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="h-[340px]">{children}</CardContent>
    </Card>
  );
}
