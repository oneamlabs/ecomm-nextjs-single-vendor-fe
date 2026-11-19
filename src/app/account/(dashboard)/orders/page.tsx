import type { Metadata } from "next";
import { OrderList } from "@/components/auth/account-parts";
import { readAccountOrNull } from "@/lib/auth/read-account";
import { readOrderItemLabels } from "@/lib/auth/order-labels";

export const metadata: Metadata = {
  title: "Your orders - Kraya",
  description: "Every order placed with Kraya.",
  robots: { index: false, follow: true },
};

/** The frame, session and signed-out fallback live in the group layout. */
export default async function AccountOrdersPage() {
  const account = await readAccountOrNull();
  if (!account) return null;

  const labels = await readOrderItemLabels(
    account.orders.flatMap((order) => order.items),
  );

  return (
    <>
      <header>
        <h1 className="text-[length:var(--text-page-title)]">Your orders</h1>
        <p className="mt-2 text-sm text-ink-2">
          {account.orders.length === 0
            ? "Nothing ordered yet."
            : `${account.orders.length} ${account.orders.length === 1 ? "order" : "orders"} in this demo account.`}
        </p>
      </header>

      <div className="mt-8">
        <OrderList orders={account.orders} labels={labels} />
      </div>
    </>
  );
}
