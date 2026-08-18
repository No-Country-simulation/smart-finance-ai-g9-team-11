import type {
  Transaction,
} from "@/types/transaction";

export interface DeleteTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onDeleted?: () => void | Promise<void>;
}