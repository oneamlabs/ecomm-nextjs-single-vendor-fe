import { formatPrice } from "@/lib/money";
import type { AccountResponse, Order, OrderStatus } from "@/lib/auth/types";
import { PackageIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  processing: "bg-accent-soft text-accent-hover",
  shipped: "bg-accent-soft text-accent-hover",
  delivered: "bg-paper-2 text-ink-2",
  cancelled: "bg-sale-soft text-sale",
};

export function OrderList({
  orders,
  labels,
}: {
  orders: Order[];
  labels: Record<string, { label: string; quantity: number }>;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-rule bg-paper-2 p-8">
        <PackageIcon size={28} weight="duotone" className="text-accent" aria-hidden="true" />
        <p className="mt-3 font-semibold text-ink">No orders yet</p>
        <p className="mt-1 max-w-[44ch] text-sm text-ink-2">
          When this demo places an order, it would appear here.
        </p>
        <Link href="/shop" className="btn btn--primary mt-4">
          Shop the range
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-rule bg-paper p-4"
        >
          <div className="min-w-0">
            <p className="num font-semibold text-ink">{order.id}</p>
            <p className="mt-0.5 text-xs text-muted">
              {order.placedAt} · {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-2">
              {order.items.map((item) => {
                const entry = labels[`${item.productId}::${item.variantId}`];
                return (
                  <li key={`${item.productId}-${item.variantId}`}>
                    {entry?.label ?? item.productId.replace(/-/g, " ")}
                    <span className="num text-muted"> ×{item.quantity}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_CLASS[order.status]}`}
            >
              {ORDER_STATUS_LABEL[order.status]}
            </span>
            <span className="num font-semibold text-ink">
              {formatPrice(order.totalCents)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The three headline figures shared by the overview. */
export function AccountStats({ account }: { account: AccountResponse }) {
  const spendCents = account.orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <Stat label="Orders" value={String(account.orders.length)} hint="Including open ones" />
      <Stat label="Total spent" value={formatPrice(spendCents)} hint="Excludes cancelled" />
      <Stat
        label="Addresses"
        value={String(account.addresses.length)}
        hint="Saved for checkout"
      />
    </dl>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-rule bg-paper p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </dt>
      <dd className="num mt-1 text-2xl font-bold text-ink">{value}</dd>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
