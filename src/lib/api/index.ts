import "server-only";

/**
 * The server API surface. Only this barrel is imported by pages and components
 * on the server; the axios instance and the in-process adapter stay behind it.
 */
export { serverApi, type Api as ServerApi } from "./server";
export { ApiError } from "./types";
export { isMissingResource } from "./errors";
export type {
  ApiErrorBody,
  ApiErrorCode,
  CategoryListResponse,
  Paginated,
  ProductDetailResponse,
  ProductFacets,
  ProductListQuery,
  ProductListResponse,
  VendorListResponse,
} from "./types";
