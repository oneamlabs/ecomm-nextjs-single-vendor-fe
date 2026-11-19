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
      className={`btn grid min-h-11 w-11 place-items-center p-0 ${
        saved ? "text-accent" : ""
      }`}
    >
      <HeartIcon
        aria-hidden="true"
        size={20}
        weight={saved ? "fill" : "regular"}
      />
    </button>
  );
}
