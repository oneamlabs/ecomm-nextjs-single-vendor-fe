"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  subscribeToWishlist,
  toggleWishlist,
} from "@/lib/wishlist-store";

interface WishlistButtonProps {
  productId: string;
  name: string;
}

export function WishlistButton({
  productId,
  name,
}: WishlistButtonProps) {
  const ids = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot,
  );
  const saved = ids.includes(productId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${name} ${
        saved ? "from" : "to"
      } the saved list`}
      onClick={() => toggleWishlist(productId)}
      className={`grid size-10 place-items-center rounded-full border border-rule bg-paper/95 shadow-card transition hover:border-sale hover:text-sale ${
        saved ? "text-sale" : "text-ink-2"
      }`}
    >
      <HeartIcon
        aria-hidden="true"
        size={18}
        weight={saved ? "fill" : "regular"}
      />
    </button>
  );
}
