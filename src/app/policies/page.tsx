import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Policies - Kraya",
  description:
    "Shipping, returns, privacy and terms for the Kraya demo marketplace.",
  alternates: { canonical: "/policies" },
};

const POLICIES = [
  {
    id: "shipping",
    title: "Shipping",
    body: "Orders are packed by the vendor and dispatched within two working days. Delivery takes 3 to 5 days across India. Delivery is ₹49, and free over ₹999.",
  },
  {
    id: "returns",
    title: "Returns and refunds",
    body: "If a pack arrives damaged or wrong, contact us within 48 hours with a photograph. We replace the item or refund it in full.",
  },
  {
    id: "privacy",
    title: "Privacy",
    body: "This demo does not store accounts, payment details or newsletter subscriptions. Cart and saved items live only in your browser.",
  },
  {
    id: "terms",
    title: "Terms of service",
    body: "Prices, products and vendors are sample data for a design demo. No order is placed and no payment is taken.",
  },
];

export default function PoliciesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Policies"
        lede="The short version of how this demo marketplace behaves."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {POLICIES.map((policy) => (
          <section
            key={policy.id}
            id={policy.id}
            className="rounded-[var(--radius-md)] border border-rule bg-paper p-6"
          >
            <h2 className="font-body text-base font-bold text-ink">
              {policy.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              {policy.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        Photograph credits are listed on the{" "}
        <Link href="/credits" className="link-quiet font-semibold text-accent">
          credits page
        </Link>
        .
      </p>
    </PageShell>
  );
}
