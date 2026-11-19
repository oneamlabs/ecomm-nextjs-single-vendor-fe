import { z } from "zod";

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

const STORAGE_KEY = "kraya-cart";
const LEGACY_KEY = "pantry-row-cart";
const STORAGE_VERSION = 2;
export const MAX_LINE_QUANTITY = 10;
const EMPTY: CartLine[] = [];

/**
 * Persisted cart is untrusted input: it is validated on every restore, so a
 * hand-edited or stale value cannot inject a bad product, variant or quantity.
 */
const cartLineSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
});

const envelopeSchema = z.object({
  version: z.number().int(),
  lines: z.array(cartLineSchema),
});

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function dedupe(items: CartLine[]): CartLine[] {
  const byKey = new Map<string, CartLine>();
  for (const line of items) {
    const key = `${line.productId}::${line.variantId}`;
    const existing = byKey.get(key);
    if (existing) {
      byKey.set(key, {
        ...existing,
        quantity: Math.min(MAX_LINE_QUANTITY, existing.quantity + line.quantity),
      });
    } else {
      byKey.set(key, { ...line });
    }
  }
  return [...byKey.values()];
}

function parseStored(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY;
  }

  // Version 1 stored a bare array; version 2 wraps it in an envelope. Both are
  // accepted so an existing basket survives the change.
  const envelope = envelopeSchema.safeParse(
    Array.isArray(parsed) ? { version: 1, lines: parsed } : parsed,
  );

  if (envelope.success) return dedupe(envelope.data.lines);

  // Last resort: keep only the individual lines that validate.
  if (Array.isArray(parsed)) {
    return dedupe(
      parsed.flatMap((item) => {
        const line = cartLineSchema.safeParse(item);
        return line.success ? [line.data] : [];
      }),
    );
  }

  return EMPTY;
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  const raw =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_KEY);
  return parseStored(raw);
}

function ensureLoaded() {
  if (loaded) return;
  lines = readStorage();
  loaded = true;
}

function commit(next: CartLine[]) {
  lines = next;
  loaded = true;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: STORAGE_VERSION, lines: next }),
  );
  listeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartLine[] {
  ensureLoaded();
  return lines;
}

export function getServerCartSnapshot(): CartLine[] {
  return EMPTY;
}

export function addCartLine(productId: string, variantId: string, quantity = 1) {
  ensureLoaded();
  if (!productId || !variantId || quantity < 1) return;

  const existing = lines.find(
    (line) => line.productId === productId && line.variantId === variantId,
  );
  if (!existing) {
    commit([
      ...lines,
      { productId, variantId, quantity: Math.min(quantity, MAX_LINE_QUANTITY) },
    ]);
    return;
  }
  commit(
    lines.map((line) =>
      line === existing
        ? {
            ...line,
            quantity: Math.min(MAX_LINE_QUANTITY, line.quantity + quantity),
          }
        : line,
    ),
  );
}

export function setCartQuantity(
  productId: string,
  variantId: string,
  quantity: number,
) {
  ensureLoaded();
  const isSame = (line: CartLine) =>
    line.productId === productId && line.variantId === variantId;

  if (!Number.isFinite(quantity) || quantity < 1) {
    commit(lines.filter((line) => !isSame(line)));
    return;
  }
  const bounded = Math.min(Math.floor(quantity), MAX_LINE_QUANTITY);
  commit(
    lines.map((line) => (isSame(line) ? { ...line, quantity: bounded } : line)),
  );
}

export function removeCartLine(productId: string, variantId: string) {
  ensureLoaded();
  commit(
    lines.filter(
      (line) => !(line.productId === productId && line.variantId === variantId),
    ),
  );
}

export function clearCart() {
  commit([]);
}

export function summariseCart(cartLines: CartLine[]) {
  let totalQuantity = 0;

  for (const line of cartLines) {
    totalQuantity += line.quantity;
  }

  return { totalQuantity, itemCount: cartLines.length };
}
