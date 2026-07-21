import type { User } from "@/types/user";

export interface UserMenuProps {
  user: User;
  isOnline: boolean;
  onOpenSidebar?: () => void;
}