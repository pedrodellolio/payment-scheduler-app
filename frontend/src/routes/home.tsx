import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/transactions";
import type { Transaction } from "../models/transaction";

function Home() {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  if (isError) return <p>Error</p>;
  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Occurred At</th>
            <th>Is Recurrent</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((t, i) => (
            <tr key={i}>
              <td>{t.title}</td>
              <td>{t.valueBrl}</td>
              <td>{new Date(t.occurredAt).toDateString()}</td>
              <td>{t.isRecurrent}</td>
              <td>{t.numberOfInstallments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Home;
