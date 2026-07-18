import { SearchBar } from "@/components/layout/SearchBar";
import { userMock } from "@/mocks/user.mock";

import { UserMenu } from "../UserMenu";

import { DateRangePicker } from "./DateRangePicker";
import { NotificationButton } from "./NotificationButton";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderActions() {
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

      <UserMenu user={userMock} />
    </div>
  );
}