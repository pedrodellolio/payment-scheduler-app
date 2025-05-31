import axiosInstance from "../api/axios";
import type { Transaction } from "../models/transaction";

export const getTransactions = async () => {
  try {
    const response = await axiosInstance.get<Transaction[]>("/transactions");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions"
    );
  }
};
