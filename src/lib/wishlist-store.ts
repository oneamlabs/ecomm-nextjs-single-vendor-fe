import { z } from "zod";

const STORAGE_KEY = "kraya-wishlist";
const LEGACY_KEY = "pantry-row-wishlist";
const STORAGE_VERSION = 2;
export const MAX_SAVED = 100;
const EMPTY: string[] = [];

/**
 * A saved product id. Ids come from the catalogue (`organic-red-quinoa`) but the
 * store must not import the catalogue to check that, so it validates shape and
 * bounds only. An id that names no product simply renders nothing.
 */
const productIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[A-Za-z0-9._-]+$/);

const envelopeSchema = z.object({
  version: z.number().int(),
  ids: z.array(productIdSchema),
});

let ids: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Keep first occurrences only, then cap the list. */
function normalise(items: string[]): string[] {
  const unique = [...new Set(items)];
  return unique.slice(0, MAX_SAVED);
}

function parseStored(raw: string | null): string[] {
  if (!raw) return EMPTY;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY;
  }

  // Version 1 stored a bare array; version 2 wraps it in an envelope. Both are
  // accepted so an existing saved list survives the change.
  const envelope = envelopeSchema.safeParse(
    Array.isArray(parsed) ? { version: 1, ids: parsed } : parsed,
  );

  if (envelope.success) return normalise(envelope.data.ids);

  // Last resort: keep only the individual ids that validate.
  if (Array.isArray(parsed)) {
    return normalise(
      parsed.flatMap((item) => {
        const id = productIdSchema.safeParse(item);
        return id.success ? [id.data] : [];
      }),
    );
  }

  return EMPTY;
}

function readStorage(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_KEY);
  return parseStored(raw);
}

function ensureLoaded() {
  if (loaded) return;
  ids = readStorage();
  loaded = true;
}

function commit(next: string[]) {
  ids = next;
  loaded = true;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: STORAGE_VERSION, ids: next }),
  );
  listeners.forEach((listener) => listener());
}

export function subscribeToWishlist(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getWishlistSnapshot(): string[] {
  ensureLoaded();
  return ids;
}

export function getServerWishlistSnapshot(): string[] {
  return EMPTY;
}

export function toggleWishlist(productId: string) {
  ensureLoaded();
  const id = productIdSchema.safeParse(productId);
  if (!id.success) return;

  if (ids.includes(id.data)) {
    commit(ids.filter((item) => item !== id.data));
    return;
  }
  commit(normalise([...ids, id.data]));
}

export function saveToWishlist(productId: string) {
  ensureLoaded();
  const id = productIdSchema.safeParse(productId);
  if (!id.success) return;
  if (ids.includes(id.data)) return;
  commit(normalise([...ids, id.data]));
}
