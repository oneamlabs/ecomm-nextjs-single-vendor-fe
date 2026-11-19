import type { Metadata } from "next";
import { AccountStats, OrderList } from "@/components/auth/account-parts";
import { readAccountOrNull } from "@/lib/auth/read-account";
import { readOrderItemLabels } from "@/lib/auth/order-labels";

export const metadata: Metadata = {
  title: "Account - Kraya",
  description: "Your orders, addresses and account details.",
  robots: { index: false, follow: true },
};

/** The frame, session and signed-out fallback live in the group layout. */
export default async function AccountPage() {
  const account = await readAccountOrNull();
  if (!account) return null;

  const labels = await readOrderItemLabels(
    account.orders.flatMap((order) => order.items),
  );

  return (
    <>
      <header>
        <p className="tag">Signed in</p>
        <h1 className="mt-3 text-[length:var(--text-page-title)]">
          Hello, {account.profile.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          {account.profile.email}
          {account.profile.city ? ` · ${account.profile.city}` : ""}
          {account.profile.memberSince
            ? ` · Member since ${account.profile.memberSince}`
            : ""}
        </p>
      </header>

      {account.isDemoSignup && (
        <p className="mt-6 rounded-[var(--radius-sm)] bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-2">
          This account was created in this demo session. It has no order history yet, and it
          will be gone when the server restarts.
        </p>
      )}

      <div className="mt-8">
        <AccountStats account={account} />
      </div>

      <section className="mt-10" aria-labelledby="recent-orders">
        <h2 id="recent-orders" className="text-[length:var(--text-section-s)]">
          Recent orders
        </h2>
        <div className="mt-4">
          <OrderList orders={account.orders.slice(0, 2)} labels={labels} />
        </div>
      </section>
    </>
  );
}
