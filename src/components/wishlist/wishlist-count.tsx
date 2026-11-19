"use client";

import { useSyncExternalStore } from "react";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  subscribeToWishlist,
} from "@/lib/wishlist-store";

export function WishlistCount() {
  const ids = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot,
  );

  if (ids.length === 0) {
    return <span aria-hidden="true" className="inline-block min-w-7" />;
  }

  return (
    <>
      <span
        aria-hidden="true"
        className="num inline-flex min-w-7 items-center justify-center rounded-[var(--radius-pill)] bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-ink"
      >
        {ids.length}
      </span>
      <span className="sr-only">
        , {ids.length} {ids.length === 1 ? "saved item" : "saved items"}
      </span>
    </>
  );
}
