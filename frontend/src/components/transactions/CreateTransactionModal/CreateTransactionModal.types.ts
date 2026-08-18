import type {
  Transaction,
} from "@/types/transaction";

export interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (
    transaction: Transaction,
  ) => void | Promise<void>;
}