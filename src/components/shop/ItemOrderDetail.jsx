import { formatCurrency } from "@/helpers";

export default function ItemInOrderItem({ detailOrder }) {
  return (
    <div key={detailOrder.id} className="flex gap-x-[13px]  text-2xl">
      <p className="flex-1">
        {detailOrder.quantity} x {detailOrder.product.name}
      </p>
      <span className="w-[146px]">
        {formatCurrency(detailOrder.quantity * detailOrder.product.price)}
      </span>
    </div>
  );
}
