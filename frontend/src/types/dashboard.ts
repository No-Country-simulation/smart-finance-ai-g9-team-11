import {
  useId,
  type ReactNode,
} from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";

type FinancialCardTrend =
  | "up"
  | "down"
  | "neutral";

export interface FinancialCardProps {
  id?: string;
  title: string;
  value: string;
  variation: string;
  trend: FinancialCardTrend;
  icon: ReactNode;
  updatedAt?: string;
  className?: string;
}