import { userMock } from "@/mocks/user.mock";

import { UserMenu } from "../UserMenu";

import { DateRangePicker } from "./DateRangePicker";
import { NotificationButton } from "./NotificationButton";
import { SyncButton } from "./SyncButton";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderActions() {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
      <div className="hidden xl:block">
        <DateRangePicker />
      </div>

      <div className="hidden sm:block">
        <ThemeToggle />
      </div>

      <NotificationButton />

      <div className="hidden lg:block">
        <SyncButton />
      </div>

      <UserMenu user={userMock} />
    </div>
  );
}