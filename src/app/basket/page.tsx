import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { BasketContents } from "@/components/cart/basket-contents";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Basket - Kraya",
  description: "The items in your basket, with delivery and the total.",
  alternates: { canonical: "/basket" },
  robots: { index: false, follow: true },
};

export default function BasketPage() {
  return (
    <PageShell>
      <PageHeader
        title="Basket"
        lede="Check the packs and quantities before you go through to checkout."
      />
      <BasketContents products={getProducts()} />
    </PageShell>
  );
}
