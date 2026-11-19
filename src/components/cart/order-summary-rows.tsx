import { formatPrice } from "@/lib/money";
import type { OrderTotals } from "@/lib/order";

interface OrderTotalsProps {
  totals: OrderTotals;
}

export function OrderSummaryRows({ totals }: OrderTotalsProps) {
  return (
    <dl className="text-sm">
      <div className="flex justify-between gap-4 py-1">
        <dt className="text-muted">Subtotal</dt>
        <dd className="num">{formatPrice(totals.subtotalCents)}</dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-rule-2 py-1">
        <dt className="text-muted">Delivery</dt>
        <dd className="num">
          {totals.deliveryCents === 0 ? "Free" : formatPrice(totals.deliveryCents)}
        </dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-rule pt-3 text-base">
        <dt>Total</dt>
        <dd className="num">{formatPrice(totals.totalCents)}</dd>
      </div>
    </dl>
  );
}
