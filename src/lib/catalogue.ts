import "server-only";

import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import type { Category, Product, Variant } from "./types";
import { discountPercent, lowestPriceCents } from "./variant";
import { getProductCertifications } from "./certifications";

/**
 * The data access layer for the catalogue. This module is server-only: it holds
 * the product JSON, which must never be bundled into a client chunk.
 * Client components import the pure helpers from `variant.ts`, `vendors.ts`,
 * `money.ts` and `types.ts` instead, and receive product records as props.
 */

const products = productsJson.products as Product[];
const categories = categoriesJson.categories as Category[];

export { getVendor, getVendors } from "./vendors";
export { getPhoto, hasPhoto } from "./photos";
export {
  defaultVariant,
  discountPercent,
  lowestPriceCents,
  variantMrpCents,
} from "./variant";
export { CERTIFICATIONS } from "./certifications";

export function getCategories(): Category[] {
  return categories;
}

export function getProducts(
  filter: {
    categoryId?: string;
    tags?: string[];
    diets?: string[];
    vendorId?: string;
    vendorIds?: string[];
    certifications?: string[];
    minPriceCents?: number;
    maxPriceCents?: number;
    minDiscount?: number;
    stock?: "in" | "out";
    q?: string;
  } = {},
): Product[] {
  const query = filter.q?.trim().toLowerCase();

  return products.filter((product) => {
    if (filter.categoryId && product.categoryId !== filter.categoryId) return false;

    if (filter.vendorId && product.vendorId !== filter.vendorId) return false;

    if (filter.vendorIds && filter.vendorIds.length > 0) {
      if (!product.vendorId || !filter.vendorIds.includes(product.vendorId)) return false;
    }

    if (filter.tags && filter.tags.length > 0) {
      const matches = filter.tags.some((tag) =>
        tag === "organic" ? product.organic : product.tags.includes(tag),
      );
      if (!matches) return false;
    }

    if (filter.diets && filter.diets.length > 0) {
      const matches = filter.diets.some((diet) => product.diets?.includes(diet));
      if (!matches) return false;
    }

    if (filter.certifications && filter.certifications.length > 0) {
      const productCertifications = getProductCertifications(product);
      const matches = filter.certifications.some((item) =>
        productCertifications.includes(item),
      );
      if (!matches) return false;
    }

    if (filter.minPriceCents !== undefined && lowestPriceCents(product) < filter.minPriceCents) {
      return false;
    }
    if (filter.maxPriceCents !== undefined && lowestPriceCents(product) > filter.maxPriceCents) {
      return false;
    }

    if (filter.minDiscount !== undefined) {
      const discount = discountPercent(product);
      if (discount === undefined || discount < filter.minDiscount) return false;
    }

    if (filter.stock) {
      const inStock = product.variants.some((variant) => variant.inStock);
      if (filter.stock === "in" && !inStock) return false;
      if (filter.stock === "out" && inStock) return false;
    }

    if (query) {
      const haystack = `${product.name} ${product.summary} ${product.origin}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getVariants(): Variant[] {
  return products.flatMap((product) => product.variants);
}

export function findVariant(productId: string, variantId: string): Variant | undefined {
  return getProduct(productId)?.variants.find((variant) => variant.id === variantId);
}

export type ProductSort = "popular" | "price" | "price-desc" | "name";

export function sortProducts(items: Product[], sort: ProductSort): Product[] {
  if (sort === "price") {
    return items.toSorted((a, b) => lowestPriceCents(a) - lowestPriceCents(b));
  }
  if (sort === "price-desc") {
    return items.toSorted((a, b) => lowestPriceCents(b) - lowestPriceCents(a));
  }
  if (sort === "popular") {
    // Popular is the curated catalogue order: the trending six first, then the
    // rest of the shelves.
    return items;
  }
  return items.toSorted((a, b) => a.name.localeCompare(b.name));
}

export function toProductSort(value: string | undefined): ProductSort {
  if (value === "price" || value === "price-desc" || value === "name") {
    return value;
  }
  return "popular";
}
