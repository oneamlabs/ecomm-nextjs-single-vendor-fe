import vendorsJson from "@/data/vendors.json";
import type { Vendor } from "./types";

/**
 * Vendor reference data is small (four public records) and every product card
 * prints the seller name, so this stays importable from client components.
 * Product records are the large payload and live in the server-only catalogue.
 */
const vendors = vendorsJson.vendors as Vendor[];

export function getVendors(): Vendor[] {
  return vendors;
}

export function getVendor(id: string | undefined): Vendor | undefined {
  return vendors.find((vendor) => vendor.id === id);
}
