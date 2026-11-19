import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { VendorCard } from "@/components/home/vendor-card";
import { PageShell } from "@/components/layout/page-shell";
import { getVendors } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Vendors - Kraya",
  description:
    "The verified organic producers and local brands that sell through Kraya.",
  alternates: { canonical: "/vendors" },
};

export default function VendorsPage() {
  const vendors = getVendors();

  return (
    <PageShell>
      <PageHeader
        title="Our vendors"
        lede="Verified producers and local brands, each quality-checked before their first listing."
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <VendorCard vendor={vendor} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
