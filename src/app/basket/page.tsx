import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { BasketContents } from "@/components/cart/basket-contents";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Cart - Kraya",
  description: "The items in your cart, with delivery and the total.",
  alternates: { canonical: "/basket" },
  robots: { index: false, follow: true },
};

export default function BasketPage() {
  return (
    <PageShell>
      <PageHeader
        title="Cart"
        lede="Check the packs and quantities before you go through to checkout."
      />
      <BasketContents products={getProducts()} />
    </PageShell>
  );
}
