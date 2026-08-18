import { SearchBar } from "@/components/layout/SearchBar";

import { useAuth } from "@/hooks/useAuth";

import { UserMenu } from "../UserMenu";

import { DateRangePicker } from "./DateRangePicker";
import { NotificationButton } from "./NotificationButton";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderActionsProps {
  onOpenSidebar?: () => void;
}

export function HeaderActions({
  onOpenSidebar,
}: Readonly<HeaderActionsProps>) {
  const {
    user,
  } = useAuth();

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-2">
      <SearchBar className="hidden w-[240px] 2xl:block" />

      <div className="hidden lg:block">
        <DateRangePicker />
      </div>

      <div className="hidden sm:block">
        <ThemeToggle />
      </div>

      <NotificationButton />

      {user && (
        <UserMenu
          user={{
            id: String(user.id),
            name: user.nome,
            email: user.email,
            financialProfile: "Regular",
            memberSince: "",
            preferences: {
              currency: "BRL",
              language: "pt-BR",
              receiveFinancialAlerts: false,
              receiveAiRecommendations: false,
              receiveMonthlySummary: false,
            },
          }}
          isOnline={user.ativo}
          onOpenSidebar={
            onOpenSidebar
          }
        />
      )}
    </div>
  );
}