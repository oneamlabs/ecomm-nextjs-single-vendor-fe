import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { WishlistContents } from "@/components/wishlist/wishlist-contents";
import { serverApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Saved - Kraya",
  description: "The organic products kept for later.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  const { items: products } = await serverApi.listProducts({ pageSize: 48 });

  return (
    <PageShell>
      <PageHeader
        title="Saved"
        lede="The organic products you have kept for later."
      />
      <WishlistContents products={products} />
    </PageShell>
  );
}
