/**
 * Every API path in one place. The axios client, the in-process server adapter
 * and any future caller build URLs from these, so a route rename is a
 * one-line change rather than a search across the codebase.
 */
const BASE = "/api";

export const ENDPOINTS = {
  products: {
    list: `${BASE}/products`,
    detail: (id: string) => `${BASE}/products/${encodeURIComponent(id)}`,
    /** The product page bundle: record, long copy and reviews. */
    full: (id: string) => `${BASE}/products/${encodeURIComponent(id)}/detail`,
  },
  categories: {
    list: `${BASE}/categories`,
  },
  vendors: {
    list: `${BASE}/vendors`,
  },
  auth: {
    signIn: `${BASE}/auth/sign-in`,
    signUp: `${BASE}/auth/sign-up`,
    signOut: `${BASE}/auth/sign-out`,
    session: `${BASE}/auth/session`,
  },
  account: {
    summary: `${BASE}/account`,
  },
} as const;

/**
 * Read the product id out of a detail path, for adapters and tests that match
 * on a URL rather than calling `ENDPOINTS.products.detail` directly. Returns
 * `undefined` for the list path, an empty id, or anything nested below it.
 */
export function productIdFromPath(pathname: string): string | undefined {
  const prefix = `${ENDPOINTS.products.list}/`;
  if (!pathname.startsWith(prefix)) return undefined;

  const rest = pathname.slice(prefix.length);
  if (!rest || rest.includes("/")) return undefined;

  return decodeURIComponent(rest);
}

/** Read the product id out of a `/detail` path, and nothing else. */
export function productIdFromDetailPath(pathname: string): string | undefined {
  const prefix = `${ENDPOINTS.products.list}/`;
  const suffix = "/detail";
  if (!pathname.startsWith(prefix) || !pathname.endsWith(suffix)) return undefined;

  const rest = pathname.slice(prefix.length, pathname.length - suffix.length);
  if (!rest || rest.includes("/")) return undefined;

  return decodeURIComponent(rest);
}
