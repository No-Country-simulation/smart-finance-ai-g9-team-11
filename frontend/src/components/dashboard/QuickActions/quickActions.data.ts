import {
  FileUp,
  Lightbulb,
  Plus,
  Sparkles,
} from "lucide-react";

import type { QuickAction } from "./QuickActions.types";

export const dashboardQuickActions = [
  {
    id: "add-transaction",
    title: "Nova transação",
    description: "Registre uma receita ou despesa.",
    icon: Plus,
    variant: "primary",
  },
  {
    id: "run-analysis",
    title: "Analisar finanças",
    description: "Atualize sua avaliação financeira.",
    icon: Sparkles,
    variant: "success",
  },
  {
    id: "view-recommendations",
    title: "Recomendações",
    description: "Veja orientações geradas pela IA.",
    icon: Lightbulb,
    variant: "warning",
  },
  {
    id: "import-transactions",
    title: "Importar transações",
    description: "Envie movimentações por arquivo.",
    icon: FileUp,
    variant: "neutral",
    disabled: true,
    badge: "Em breve",
  },
] satisfies readonly QuickAction[];