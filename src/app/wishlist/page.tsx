import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { WishlistContents } from "@/components/wishlist/wishlist-contents";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Saved - Kraya",
  description: "The provisions kept for later.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <PageShell>
      <PageHeader
        title="Saved"
        lede="The provisions you have kept for later."
      />
      <WishlistContents products={getProducts()} />
    </PageShell>
  );
}
