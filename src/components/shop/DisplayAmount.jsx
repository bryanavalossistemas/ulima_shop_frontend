import { formatCurrency } from "@/helpers";

export default function DisplayAmount({ amount }) {
  return (
    <div className="flex justify-end">
      <p className="mt-4 font-bold text-xl">Total: {formatCurrency(amount)}</p>
    </div>
  );
}
