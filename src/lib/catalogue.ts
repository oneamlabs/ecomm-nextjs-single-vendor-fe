import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import vendorsJson from "@/data/vendors.json";
import type { Category, Product, Variant, Vendor } from "./types";

const products = productsJson.products as Product[];
const categories = categoriesJson.categories as Category[];
const vendors = vendorsJson.vendors as Vendor[];

export { getPhoto, hasPhoto } from "./photos";

export const CERTIFICATIONS = [
  { id: "organic-india", label: "Organic India" },
  { id: "usda-organic", label: "USDA Organic" },
  { id: "fssai", label: "FSSAI" },
] as const;

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

export function getVendors(): Vendor[] {
  return vendors;
}

export function getVendor(id: string | undefined): Vendor | undefined {
  return vendors.find((vendor) => vendor.id === id);
}

export function getVariants(): Variant[] {
  return products.flatMap((product) => product.variants);
}

export function findVariant(productId: string, variantId: string): Variant | undefined {
  return getProduct(productId)?.variants.find((variant) => variant.id === variantId);
}

export function lowestPriceCents(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.priceCents));
}

export function defaultVariant(product: Product): Variant {
  return product.variants.find((variant) => variant.inStock) ?? product.variants[0];
}

export function variantMrpCents(
  product: Product,
  variant: Variant,
): number | undefined {
  if (variant.mrpCents !== undefined) return variant.mrpCents;

  if (product.mrpCents === undefined) return undefined;

  const base = defaultVariant(product);
  if (variant.id === base.id) return product.mrpCents;

  return Math.round((product.mrpCents * variant.priceCents) / base.priceCents / 100) * 100;
}

export function discountPercent(product: Product): number | undefined {
  if (!product.mrpCents) return undefined;
  const price = defaultVariant(product).priceCents;
  if (product.mrpCents <= price) return undefined;
  return Math.round(((product.mrpCents - price) / product.mrpCents) * 100);
}

/**
 * Sample certification records for the demo catalogue. Every product is an
 * Organic India and FSSAI listing; the hill and Karnataka vendors also carry a
 * USDA Organic record.
 */
export function getProductCertifications(product: Product): string[] {
  const list = ["organic-india", "fssai"];
  if (product.vendorId === "pahadi-organics" || product.vendorId === "greenharvest") {
    list.push("usda-organic");
  }
  return list;
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
