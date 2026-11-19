import { SectionHeader } from "@/components/layout/section";
import type { Vendor } from "@/lib/types";
import { VendorCard } from "./vendor-card";

export function VendorShowcase({ vendors }: { vendors: Vendor[] }) {
  return (
    <div>
      <SectionHeader
        title="Featured Vendors"
        lede="Discover top-rated organic sellers from across India"
        action={{ href: "/vendors", label: "View All Vendors" }}
      />

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <VendorCard vendor={vendor} />
          </li>
        ))}
      </ul>
    </div>
  );
}
