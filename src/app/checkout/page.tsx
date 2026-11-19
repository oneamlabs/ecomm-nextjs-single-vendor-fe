import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Checkout - Kraya",
  description:
    "Address and delivery window, with the order summary beside the form.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <PageShell>
      <PageHeader
        title="Checkout"
        lede="Where it goes and when it arrives. Two steps, no account."
      />
      <CheckoutForm products={getProducts()} />
    </PageShell>
  );
}
