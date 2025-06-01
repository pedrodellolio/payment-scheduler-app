import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTransactions } from "../api/transactions";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import type { CreateTransactionForm } from "../models/transaction";

type Props = {};

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function TransactionsForm({}: Props) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateTransactionForm) => postTransactions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTransactionForm>({
    defaultValues: {
      valueBrl: 0,
      occurredAt: new Date(),
    },
  });

  const [isRecurrent, setIsRecurrent] = useState(false);

  const onSubmit: SubmitHandler<CreateTransactionForm> = async (data) => {
    await mutateAsync(data);
  };

  if (isRecurrent) {
    console.log("Monthly");
    setValue("frequency", "monthly");
  } else {
    console.log(undefined);
    setValue("frequency", undefined);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          type="text"
          {...register("title", { required: true })}
        />
        {errors.title && <span>This field is required</span>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="valueBrl"
          className="block text-sm font-medium text-gray-700"
        >
          Value (R$)
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          type="number"
          {...register("valueBrl", { required: true })}
        />
        {errors.valueBrl && <span>This field is required</span>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="occurredAt"
          className="block text-sm font-medium text-gray-700"
        >
          Occurred At
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          type="date"
          {...register("occurredAt", { required: true })}
        />
        {errors.occurredAt && <span>This field is required</span>}
      </div>

      <div className="flex items-center space-x-2">
        <input
          className="h-4 w-4 text-teal-600 focus:ring-teal-600 border-gray-200 accent-teal-600 rounded"
          type="checkbox"
          checked={isRecurrent}
          onChange={(e) => setIsRecurrent(e.target.checked)}
        />
        <label
          htmlFor="isRecurrent"
          className="text-sm font-medium text-gray-700"
        >
          Is Recurrent
        </label>
      </div>

      {isRecurrent && (
        <>
          <div className="space-y-2">
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700"
            >
              Frequency
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              {...register("frequency", { required: true })}
            >
              {/* <option value="">Select frequency</option> */}
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.frequency && <span>This field is required</span>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="numberOfInstallments"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Installments
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              type="number"
              {...register("numberOfInstallments")}
            />
          </div>
        </>
      )}

      <div className="md:col-span-2 lg:col-span-3 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          {isPending ? "Loading..." : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}
