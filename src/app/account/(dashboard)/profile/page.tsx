import type { Metadata } from "next";
import { readAccountOrNull } from "@/lib/auth/read-account";

export const metadata: Metadata = {
  title: "Your details - Kraya",
  description: "The personal details on your Kraya account.",
  robots: { index: false, follow: true },
};

/** The frame, session and signed-out fallback live in the group layout. */
export default async function AccountProfilePage() {
  const account = await readAccountOrNull();
  if (!account) return null;

  return (
    <>
      <header>
        <h1 className="text-[length:var(--text-page-title)]">Your details</h1>
        <p className="mt-2 text-sm text-ink-2">
          The record this demo holds for you. Editing is not part of the demo.
        </p>
      </header>

      <dl className="mt-8 grid gap-3 rounded-[var(--radius-md)] border border-rule bg-paper p-4 text-sm">
        <Row label="Name" value={account.profile.name} />
        <Row label="Email" value={account.profile.email} />
        {account.profile.phone && <Row label="Phone" value={account.profile.phone} />}
        {account.profile.city && <Row label="City" value={account.profile.city} />}
        {account.profile.memberSince && (
          <Row label="Member since" value={account.profile.memberSince} />
        )}
      </dl>

      <p className="mt-4 text-xs text-muted">
        Nothing here is sent anywhere. A real deployment would let you edit these.
      </p>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-rule-2 pb-2 last:border-b-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
