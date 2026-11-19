import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { BasketContents } from "@/components/cart/basket-contents";
import { CartAssurance } from "@/components/cart/cart-assurance";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Cart - Kraya",
  description:
    "Review the items in your cart, apply offers and proceed to checkout.",
  alternates: { canonical: "/basket" },
  robots: { index: false, follow: true },
};

export default function BasketPage() {
  return (
    <PageShell>
      <BasketContents products={getProducts()} />
      <CartAssurance />
    </PageShell>
  );
}
