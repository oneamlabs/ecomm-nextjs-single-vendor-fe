"use client";

import { useSyncExternalStore } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  subscribeToWishlist,
} from "@/lib/wishlist-store";

export function WishlistContents({ products }: { products: Product[] }) {
  const ids = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot,
  );
  const productById = new Map(products.map((product) => [product.id, product]));
  const saved = ids
    .map((id) => productById.get(id))
    .filter((product): product is Product => product !== undefined);

  if (saved.length === 0) {
    return (
      <div className="mt-10">
        <EmptyState
          title="Nothing saved"
          body="Save a provision from any card and it will wait here."
          action={{ href: "/shop", label: "Shop the range" }}
        />
      </div>
    );
  }

  return (
    <>
      <h2 className="sr-only">Saved products</h2>
      <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {saved.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
