import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "../models/transaction";
import { deleteTransactions, getTransactions } from "../api/transactions";
import { useEffect, useRef, useState } from "react";

type Props = {};

export default function TransactionsTable({}: Props) {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(true),
  });

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteTransactions(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id: string) => {
    await mutateAsync(id);
    setOpenMenuIndex(null);
  };

  const toggleMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const capitalizeText = (text: string) => {
    if (!text) return "";
    return text.substring(0, 1).toUpperCase() + text.substring(1, text.length);
  };

  if (isError) return <p>Error</p>;
  if (isLoading) return <p>Loading...</p>;
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Value
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Recurrent
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Next Payment
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Installments
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {transactions?.length === 0 ? (
          <tr>
            <td
              colSpan={7}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              No entries yet. Add one using the form above.
            </td>
          </tr>
        ) : (
          transactions?.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors duration-150 group relative`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(Number(item.valueBrl))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.occurredAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.frequency ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.nextPaymentDate ? formatDate(item.nextPaymentDate) : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {capitalizeText(item.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                <div className="flex items-center justify-between">
                  <span>{item.numberOfInstallments ?? "-"}</span>
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      aria-label="More options"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {openMenuIndex === index && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-8 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                      >
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
