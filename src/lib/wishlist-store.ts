const STORAGE_KEY = "kraya-wishlist";
const LEGACY_KEY = "pantry-row-wishlist";
const EMPTY: string[] = [];

let ids: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isProductId(value: unknown): value is string {
  return typeof value === "string";
}

function readStorage(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem(LEGACY_KEY) ??
        "[]",
    );
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isProductId);
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded) return;
  ids = readStorage();
  loaded = true;
}

function commit(next: string[]) {
  ids = next;
  loaded = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
  if (ids.includes(productId)) {
    commit(ids.filter((id) => id !== productId));
    return;
  }
  commit([...ids, productId]);
}

export function saveToWishlist(productId: string) {
  ensureLoaded();
  if (ids.includes(productId)) return;
  commit([...ids, productId]);
}
