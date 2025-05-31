export interface Transaction {
  title: string;
  valueBrl: number;
  occurredAt: string;
  isRecurrent: boolean;
  numberOfInstallments?: number;
}
