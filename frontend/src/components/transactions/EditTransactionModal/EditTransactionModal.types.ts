import type {
  Transaction,
} from "@/types/transaction";

export interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onUpdated?: (
    transaction: Transaction,
  ) => void | Promise<void>;
}