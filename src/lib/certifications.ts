import type { Product } from "./types";

/**
 * Certification labels and the sample records every product carries. Pure and
 * data-free, so the shop page can label filters without touching the server-only
 * catalogue.
 */
export const CERTIFICATIONS = [
  { id: "organic-india", label: "Organic India" },
  { id: "usda-organic", label: "USDA Organic" },
  { id: "fssai", label: "FSSAI" },
] as const;

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
