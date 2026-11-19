import type { Category, Product, Vendor } from "@/lib/types";

export type { Category, Product, Vendor } from "@/lib/types";

/**
 * The HTTP contract. These are the shapes the route handlers return and the
 * axios client parses. They are deliberately separate from the internal data
 * layer types so a real backend can change without rewriting components.
 */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface ProductListQuery {
  category?: string;
  q?: string;
  tag?: string[];
  diet?: string[];
  vendor?: string[];
  certification?: string[];
  min?: number;
  max?: number;
  discount?: number;
  stock?: "in" | "out";
  sort?: "popular" | "price" | "price-desc" | "name";
  page?: number;
  pageSize?: number;
}

export type ProductListResponse = Paginated<Product>;
export type CategoryListResponse = { items: Category[] };
export type VendorListResponse = { items: Vendor[] };

/**
 * Every failure leaves the API in this shape, so the client has one error type
 * to handle rather than guessing from status codes and HTML error pages.
 */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export type ApiErrorCode =
  | "bad_request"
  | "not_found"
  | "internal_error"
  | "network_error"
  | "timeout";

/** One application-level error, produced by the client for every failure path. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}
