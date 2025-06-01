export interface Transaction {
  id: string;
  title: string;
  valueBrl: number;
  occurredAt: string;
  numberOfInstallments?: number;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
}

export type CreateTransactionForm = {
  title: string;
  valueBrl: number;
  occurredAt: Date;
  numberOfInstallments: number;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
};