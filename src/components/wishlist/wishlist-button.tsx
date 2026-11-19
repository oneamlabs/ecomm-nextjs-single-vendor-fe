"use client";

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
  compact?: boolean;
}

export function WishlistButton({
  productId,
  name,
  compact = false,
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
      className={`btn grid place-items-center p-0 ${
        compact ? "min-h-11 w-11 md:min-h-9 md:w-9" : "min-h-11 w-11"
      } ${saved ? "text-accent" : ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-5"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l8.84 8.84 8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
