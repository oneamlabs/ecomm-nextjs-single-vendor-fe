import type { Metadata } from "next";
import { readAccountOrNull } from "@/lib/auth/read-account";

export const metadata: Metadata = {
  title: "Your addresses - Kraya",
  description: "The addresses saved on your Kraya account.",
  robots: { index: false, follow: true },
};

/** The frame, session and signed-out fallback live in the group layout. */
export default async function AccountAddressesPage() {
  const account = await readAccountOrNull();
  if (!account) return null;

  return (
    <>
      <header>
        <h1 className="text-[length:var(--text-page-title)]">Addresses</h1>
        <p className="mt-2 text-sm text-ink-2">
          Kept for checkout. This demo does not save new ones.
        </p>
      </header>

      {account.addresses.length === 0 ? (
        <p className="mt-8 rounded-[var(--radius-md)] border border-rule bg-paper-2 p-6 text-sm text-ink-2">
          No addresses saved. Checkout asks for one each time.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {account.addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-[var(--radius-md)] border border-rule bg-paper p-4"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                {address.label}
                {address.isDefault && <span className="tag">Default</span>}
              </p>
              <p className="mt-2 text-sm text-ink-2">{address.line}</p>
              <p className="text-sm text-ink-2">
                {address.city}, {address.state} {address.postcode}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
