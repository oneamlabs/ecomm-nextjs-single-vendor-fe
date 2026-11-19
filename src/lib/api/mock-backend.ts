import "server-only";

import {
  getCategories,
  getProduct,
  getProducts,
  getVendors,
  sortProducts,
  type ProductSort,
} from "@/lib/catalogue";
import { CERTIFICATIONS, getProductCertifications } from "@/lib/certifications";
import { DIETS } from "@/lib/diets";
import { getProductDetail } from "@/lib/product-details";
import { getReviews } from "@/lib/reviews";
import { discountPercent } from "@/lib/variant";
import type {
  CategoryListResponse,
  Product,
  ProductDetailResponse,
  ProductFacets,
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

  return { items, total, page, pageSize, pageCount, facets: countFacets() };
}

/** Facet counts over the whole catalogue, for the sidebar option labels. */
export function countFacets(): ProductFacets {
  const all = getProducts();

  return {
    total: all.length,
    category: Object.fromEntries(
      getCategories().map((category) => [
        category.id,
        all.filter((product) => product.categoryId === category.id).length,
      ]),
    ),
    vendor: Object.fromEntries(
      getVendors().map((vendor) => [
        vendor.id,
        all.filter((product) => product.vendorId === vendor.id).length,
      ]),
    ),
    diet: Object.fromEntries(
      DIETS.map((diet) => [
        diet.id,
        all.filter((product) => product.diets?.includes(diet.id)).length,
      ]),
    ),
    certification: Object.fromEntries(
      CERTIFICATIONS.map((certification) => [
        certification.id,
        all.filter((product) =>
          getProductCertifications(product).includes(certification.id),
        ).length,
      ]),
    ),
    discount: Object.fromEntries(
      [10, 20, 30, 40].map((threshold) => [
        threshold,
        all.filter((product) => {
          const value = discountPercent(product);
          return value !== undefined && value >= threshold;
        }).length,
      ]),
    ),
    stock: {
      in: all.filter((product) => product.variants.some((variant) => variant.inStock))
        .length,
      out: all.filter((product) =>
        product.variants.every((variant) => !variant.inStock),
      ).length,
    },
  };
}

export function readProduct(id: string): Product | undefined {
  return getProduct(id);
}

/** The product page's bundle: the record, its long copy, reviews and related rail. */
export function readProductDetail(id: string): ProductDetailResponse | undefined {
  const product = getProduct(id);
  if (!product) return undefined;

  const vendor = getVendors().find((item) => item.id === product.vendorId);
  const sameCategory = getProducts({ categoryId: product.categoryId }).filter(
    (item) => item.id !== product.id,
  );
  const rest = getProducts().filter(
    (item) => item.id !== product.id && item.categoryId !== product.categoryId,
  );

  return {
    product,
    detail: getProductDetail(product, vendor),
    reviews: getReviews(product.id),
    category: getCategories().find((item) => item.id === product.categoryId),
    vendor,
    related: [...sameCategory, ...rest].slice(0, 4),
  };
}

export function readCategories(): CategoryListResponse {
  return { items: getCategories() };
}

export function readVendors(): VendorListResponse {
  return { items: getVendors() };
}
