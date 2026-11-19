"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  addCartLine,
  clearCart as clearStoredCart,
  getCartSnapshot,
  getServerCartSnapshot,
  removeCartLine,
  setCartQuantity,
  subscribeToCart,
  summariseCart,
  type CartLine,
} from "@/lib/cart-store";

export interface Cart {
  lines: CartLine[];
  addLine: (productId: string, variantId: string, quantity?: number) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeLine: (productId: string, variantId: string) => void;
  clearCart: () => void;
  totalQuantity: number;
  itemCount: number;
}

/**
 * The basket lives in the store module, and this hook subscribes to it.
 * useSyncExternalStore renders the server snapshot during SSR and the stored
 * basket after hydration, so persistent state and a matching first paint do
 * not fight each other.
 */
export function useCart(): Cart {
  const lines = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const totals = useMemo(() => summariseCart(lines), [lines]);

  return useMemo(
    () => ({
      lines,
      addLine: addCartLine,
      setQuantity: setCartQuantity,
      removeLine: removeCartLine,
      clearCart: clearStoredCart,
      ...totals,
    }),
    [lines, totals],
  );
}
