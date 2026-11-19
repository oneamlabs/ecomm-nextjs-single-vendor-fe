import "server-only";

import {
  getCategories,
  getProduct,
  getProducts,
  getVendors,
  sortProducts,
  type ProductSort,
} from "@/lib/catalogue";
import type {
  CategoryListResponse,
  ProductListQuery,
  ProductListResponse,
  VendorListResponse,
} from "./types";

export const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;

/**
 * The mock backend. Route handlers call these functions, which read the JSON
 * catalogue through the server-only data layer. A real backend would replace
 * this file; nothing above it knows where the data came from.
 */
export function listProducts(query: ProductListQuery): ProductListResponse {
  const pageSize = Math.min(
    Math.max(Math.trunc(query.pageSize ?? DEFAULT_PAGE_SIZE), 1),
    MAX_PAGE_SIZE,
  );

  const sorted = sortProducts(
    getProducts({
      categoryId: query.category,
      q: query.q,
      tags: query.tag,
      diets: query.diet,
      vendorIds: query.vendor,
      certifications: query.certification,
      minPriceCents: query.min !== undefined ? query.min * 100 : undefined,
      maxPriceCents: query.max !== undefined ? query.max * 100 : undefined,
      minDiscount: query.discount,
      stock: query.stock,
    }),
    (query.sort ?? "popular") as ProductSort,
  );

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(Math.trunc(query.page ?? 1), 1), pageCount);
  const items = sorted.slice((page - 1) * pageSize, page * pageSize);

  return { items, total, page, pageSize, pageCount };
}

export function readProduct(id: string) {
  return getProduct(id);
}

export function readCategories(): CategoryListResponse {
  return { items: getCategories() };
}

export function readVendors(): VendorListResponse {
  return { items: getVendors() };
}
