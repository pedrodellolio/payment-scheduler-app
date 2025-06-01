import TransactionsTable from "../components/transactions-table";
import TransactionsForm from "../components/transactions-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runRecurringPaymentsJob } from "../api/transactions";

function Home() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => runRecurringPaymentsJob(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <TransactionsForm />
      </div>

      <div className="w-full flex flex-row justify-end">
        <button
          type="submit"
          disabled={isPending}
          onClick={() => mutateAsync}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          {isPending ? "Running..." : "Run now"}
        </button>
      </div>
      <div className="mt-4 bg-white rounded-lg border border-gray-200">
        <TransactionsTable />
      </div>
    </main>
  );
}

export default Home;
