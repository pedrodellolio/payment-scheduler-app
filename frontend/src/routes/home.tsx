import TransactionsTable from "../components/transactions-table";
import TransactionsForm from "../components/transactions-form";
import NotificationComponent from "../components/notifications-wrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runRecurringPaymentsJob } from "../api/transactions";
import { Play } from "lucide-react";
import { Toaster } from "sonner";

function Home() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => runRecurringPaymentsJob(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const handleRunJob = async () => {
    await mutateAsync();
  };

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <TransactionsForm />
      </div>

      <NotificationComponent />
      <div className="w-full flex flex-row justify-end">
        <button
          type="submit"
          disabled={isPending}
          onClick={handleRunJob}
          className="flex flex-row items-center px-4 py-2 bg-teal-600 text-sm text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          <Play className="w-4 h-4 mr-2" />
          {isPending ? "Running..." : "Run now"}
        </button>
      </div>
      <div className="mt-4 bg-white rounded-lg border border-gray-200">
        <TransactionsTable />
      </div>

      <Toaster />
    </main>
  );
}

export default Home;
