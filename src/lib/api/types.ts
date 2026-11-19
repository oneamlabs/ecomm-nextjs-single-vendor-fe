import type {
  Category,
  Product,
  ProductDetail,
  ProductReview,
  Vendor,
} from "@/lib/types";

export type {
  Category,
  Product,
  ProductDetail,
  ProductReview,
  Vendor,
} from "@/lib/types";

/**
 * The HTTP contract. These are the shapes the route handlers return and the
 * axios client parses. They are deliberately separate from the internal data
 * layer types so a real backend can change without rewriting components.
 */

import type { CustomerProfile } from "@/lib/auth/types";

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

export type ProductListResponse = Paginated<Product> & {
  /**
   * Counts across the whole catalogue, not the filtered page. The sidebar shows
   * these next to each option so a shopper can see what a filter would add.
   */
  facets: ProductFacets;
};

export interface ProductFacets {
  total: number;
  category: Record<string, number>;
  vendor: Record<string, number>;
  diet: Record<string, number>;
  certification: Record<string, number>;
  discount: Record<string, number>;
  stock: { in: number; out: number };
}

/** Everything a product page needs, so it is one request rather than three. */
export interface ProductDetailResponse {
  product: Product;
  detail: ProductDetail;
  reviews: ProductReview[];
  category?: Category;
  vendor?: Vendor;
  /** Same-category first, then the rest, excluding this product. */
  related: Product[];
}

export type CategoryListResponse = { items: Category[] };
export type VendorListResponse = { items: Vendor[] };

export type {
  AccountResponse,
  Address,
  CustomerProfile,
  Order,
  OrderStatus,
  SignInValues,
  SignUpValues,
} from "@/lib/auth/types";

/** What a successful sign-in or sign-up returns. */
export interface SessionResponse {
  profile: CustomerProfile;
}

/** Field-level errors, keyed by form field, for the auth forms. */
export interface AuthErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    fields?: Record<string, string>;
  };
}

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
  | "unauthenticated"
  | "not_found"
  | "internal_error"
  | "network_error"
  | "timeout";

/** One application-level error, produced by the client for every failure path. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  /** Field-level messages from a rejected form, when the server sent them. */
  readonly fields: Record<string, string>;

  constructor(
    code: ApiErrorCode,
    message: string,
    status = 0,
    fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}
