import type { AxiosInstance } from "axios";
import { ENDPOINTS } from "./endpoints";
import {
  ApiError,
  type ApiErrorBody,
  type CategoryListResponse,
  type Product,
  type ProductDetailResponse,
  type ProductListQuery,
  type ProductListResponse,
  type VendorListResponse,
} from "./types";

/**
 * Typed calls over one axios instance. The same functions run against the
 * in-process adapter on the server and the HTTP adapter in the browser, so a
 * caller never needs to know which one it got.
 */
export function createApi(instance: AxiosInstance) {
  return {
    async listProducts(query: ProductListQuery = {}): Promise<ProductListResponse> {
      return request<ProductListResponse>(() =>
        instance.get(ENDPOINTS.products.list, { params: toParams(query) }),
      );
    },

    async getProduct(id: string): Promise<Product> {
      return request<Product>(() =>
        instance.get(ENDPOINTS.products.detail(id)),
      );
    },

    /** The product page bundle: record, long copy and reviews. */
    async getProductDetail(id: string): Promise<ProductDetailResponse> {
      return request<ProductDetailResponse>(() =>
        instance.get(ENDPOINTS.products.full(id)),
      );
    },

    async getCategories(): Promise<CategoryListResponse> {
      return request<CategoryListResponse>(() =>
        instance.get(ENDPOINTS.categories.list),
      );
    },

    async getVendors(): Promise<VendorListResponse> {
      return request<VendorListResponse>(() =>
        instance.get(ENDPOINTS.vendors.list),
      );
    },
  };
}

export type Api = ReturnType<typeof createApi>;

/** Drop undefined values and expand arrays into repeated params. */
function toParams(query: ProductListQuery): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length > 0) params[key] = value;
      continue;
    }
    params[key] = String(value);
  }

  return params;
}

/**
 * Normalise every axios failure into one `ApiError`. The server's own error
 * envelope is preserved when present, so a useful message is never lost.
 */
async function request<T>(call: () => Promise<{ data: T }>): Promise<T> {
  try {
    const response = await call();
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

interface AxiosLikeError {
  code?: string;
  message?: string;
  response?: { status: number; data?: unknown };
  isAxiosError?: boolean;
}

function toApiError(error: unknown): ApiError {
  const candidate = error as AxiosLikeError;

  if (candidate?.code === "ECONNABORTED" || candidate?.code === "ETIMEDOUT") {
    return new ApiError("timeout", "The request timed out. Try again.", 0);
  }

  if (!candidate?.isAxiosError && !candidate?.response) {
    return new ApiError(
      "network_error",
      "Could not reach the API.",
      0,
    );
  }

  const status = candidate.response?.status ?? 0;
  const body = candidate.response?.data as ApiErrorBody | undefined;

  if (body?.error?.code && body.error.message) {
    return new ApiError(body.error.code, body.error.message, status);
  }

  if (status === 404) {
    return new ApiError("not_found", "That resource was not found.", 404);
  }
  if (status === 400) {
    return new ApiError("bad_request", "The request was rejected.", 400);
  }

  return new ApiError(
    "internal_error",
    "The API could not complete the request.",
    status,
  );
}
