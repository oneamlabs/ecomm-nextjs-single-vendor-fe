import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import type { Category, Product, Variant } from "./types";

const products = productsJson.products as Product[];
const categories = categoriesJson.categories as Category[];

export { getPhoto, hasPhoto } from "./photos";

export function getCategories(): Category[] {
  return categories;
}

export function getProducts(
  filter: { categoryId?: string; tags?: string[] } = {},
): Product[] {
  return products.filter((product) => {
    if (filter.categoryId && product.categoryId !== filter.categoryId) return false;
    if (filter.tags && filter.tags.length > 0) {
      const matches = filter.tags.some((tag) =>
        tag === "organic" ? product.organic : product.tags.includes(tag),
      );
      if (!matches) return false;
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

export function lowestPriceCents(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.priceCents));
}

export type ProductSort = "name" | "price";

export function sortProducts(items: Product[], sort: ProductSort): Product[] {
  if (sort === "price") {
    return items.toSorted((a, b) => lowestPriceCents(a) - lowestPriceCents(b));
  }
  return items.toSorted((a, b) => a.name.localeCompare(b.name));
}

export function toProductSort(value: string | undefined): ProductSort {
  return value === "price" ? "price" : "name";
}
