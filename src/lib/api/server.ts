import "server-only";

import { create, type AxiosAdapter } from "axios";
import { createApi } from "./client";
import { ENDPOINTS, productIdFromPath } from "./endpoints";
import { listProducts, readCategories, readProduct, readVendors } from "./mock-backend";
import { errorResponse, notFound } from "./responses";

/**
 * A server-side adapter that answers the client's HTTP calls without leaving
 * the process.
 *
 * Why: a Server Component that fetches its own route handler over real HTTP
 * needs an absolute origin. During `next build` there is no server listening,
 * and at runtime a wrong base URL silently calls whatever else is on that port.
 * Routing the calls straight to the same functions the handlers use keeps one
 * contract with no network hop. Replace this adapter with a real backend base
 * URL when one exists.
 */
const inProcessAdapter: AxiosAdapter = async (config) => {
  const url = new URL(config.url ?? "", "http://internal");
  const params = toSearchParams(config.params);
  const { pathname } = url;

  const respond = (data: unknown, status = 200) => ({
    data,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: {},
    config,
  });

  if (pathname === ENDPOINTS.products.list) {
    const result = listProducts({
      category: params.get("category") ?? undefined,
      q: params.get("q") ?? undefined,
      tag: params.getAll("tag"),
      diet: params.getAll("diet"),
      vendor: params.getAll("vendor"),
      certification: params.getAll("certification"),
      min: toNumber(params.get("min")),
      max: toNumber(params.get("max")),
      discount: toNumber(params.get("discount")),
      stock: (params.get("stock") as "in" | "out" | null) ?? undefined,
      sort: (params.get("sort") as "popular" | "price" | "price-desc" | "name" | null) ?? undefined,
      page: toNumber(params.get("page")),
      pageSize: toNumber(params.get("pageSize")),
    });
    return respond(result);
  }

  const productId = productIdFromPath(pathname);
  if (productId) {
    const product = readProduct(productId);
    if (!product) {
      const body = await notFound(`No product with id "${productId}".`).json();
      throw adapterError(config, 404, body);
    }
    return respond(product);
  }

  if (pathname === ENDPOINTS.categories.list) return respond(readCategories());
  if (pathname === ENDPOINTS.vendors.list) return respond(readVendors());

  const body = await errorResponse("not_found", "Unknown API route.").json();
  throw adapterError(config, 404, body);
};

/** Shape axios expects when an adapter rejects, so `toApiError` can read status. */
function adapterError(
  config: Parameters<AxiosAdapter>[0],
  status: number,
  data: unknown,
) {
  const error = new Error(`Request failed with status code ${status}`) as Error & {
    isAxiosError: true;
    config: typeof config;
    response: { status: number; data: unknown; statusText: string; headers: {}; config: typeof config };
  };
  error.isAxiosError = true;
  error.config = config;
  error.response = { status, data, statusText: "Error", headers: {}, config };
  return error;
}

function toSearchParams(params: unknown): URLSearchParams {
  const search = new URLSearchParams();
  if (!params || typeof params !== "object") return search;

  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
      continue;
    }
    search.set(key, String(value));
  }

  return search;
}

function toNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

const serverInstance = create({ adapter: inProcessAdapter });

export const serverApi = createApi(serverInstance);
export type Api = ReturnType<typeof createApi>;
