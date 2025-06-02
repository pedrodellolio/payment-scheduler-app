import axiosInstance from "../api/axios";
import type { CreateTransactionForm, Transaction } from "../models/transaction";

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

export const postTransactions = async (data: CreateTransactionForm) => {
  try {
    const response = await axiosInstance.post<Transaction[]>(
      "/transactions",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create transaction"
    );
  }
};

export const deleteTransactions = async (id: string) => {
  try {
    const response = await axiosInstance.delete<Transaction[]>(
      `/transactions/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete transaction"
    );
  }
};

export const runRecurringPaymentsJob = async () => {
  try {
    const response = await axiosInstance.post<Transaction[]>(
      "/transactions/run"
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to run recurring payments job"
    );
  }
};
