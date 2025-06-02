export interface Transaction {
  id: string;
  title: string;
  valueBrl: number;
  occurredAt: string;
  numberOfInstallments?: number;
  nextPaymentDate?: string;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  status: "paid" | "pending";
}

export type CreateTransactionForm = {
  title: string;
  valueBrl: number;
  occurredAt: Date;
  numberOfInstallments: number;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
};
