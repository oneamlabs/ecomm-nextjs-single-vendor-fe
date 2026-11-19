import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Become a Seller - Kraya",
  description:
    "How organic producers and local brands can apply to sell on Kraya.",
  alternates: { canonical: "/sell" },
};

const STEPS = [
  {
    title: "Apply",
    line: "Tell us where you farm or produce, and what you would like to sell.",
  },
  {
    title: "Get verified",
    line: "We check certifications, packaging and a sample of the product.",
  },
  {
    title: "Start selling",
    line: "Your store goes live with your own range, pricing and dispatch window.",
  },
];

export default function SellPage() {
  return (
    <PageShell>
      <PageHeader
        title="Become a Seller"
        lede="Kraya is a multi-vendor marketplace. Producers keep their own store, pricing and stock."
      />

      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-[var(--radius-md)] border border-rule bg-paper p-6"
          >
            <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
              {index + 1}
            </span>
            <h2 className="mt-3 font-body text-base font-bold text-ink">
              {step.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{step.line}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-[var(--radius-md)] bg-accent-soft p-6 md:flex md:items-center md:justify-between md:gap-6">
        <p className="max-w-[56ch] text-sm text-ink-2">
          This is a demo marketplace. Seller applications are not open here, and
          no form is submitted.
        </p>
        <Link href="/vendors" className="btn btn--primary mt-4 md:mt-0">
          Meet the vendors
        </Link>
      </div>
    </PageShell>
  );
}
