import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { BasketContents } from "@/components/cart/basket-contents";
import { CartAssurance } from "@/components/cart/cart-assurance";
import { serverApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Cart - Kraya",
  description:
    "Review the items in your cart, apply offers and proceed to checkout.",
  alternates: { canonical: "/basket" },
  robots: { index: false, follow: true },
};

export default async function BasketPage() {
  const { items: products } = await serverApi.listProducts({ pageSize: 48 });

  return (
    <PageShell>
      <BasketContents products={products} />
      <CartAssurance />
    </PageShell>
  );
}
