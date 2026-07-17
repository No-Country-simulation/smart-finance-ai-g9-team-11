import { DateRangePicker } from "./DateRangePicker";
import { NotificationButton } from "./NotificationButton";
import { SyncButton } from "./SyncButton";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <DateRangePicker />

      <ThemeToggle />

      <NotificationButton />

      <SyncButton />
    </div>
  );
}
