import { DateRangePicker } from "./DateRangePicker";
import { NotificationButton } from "./NotificationButton";
import { SyncButton } from "./SyncButton";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <DateRangePicker />

      <NotificationButton />

      <SyncButton />
    </div>
  );
}