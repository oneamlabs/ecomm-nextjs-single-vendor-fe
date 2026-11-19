import { Section } from "@/components/layout/section";
import { CategoryStrip } from "@/components/home/category-strip";
import { DietGrid } from "@/components/home/diet-grid";
import { FarmerBanner } from "@/components/home/farmer-banner";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { TrendingProducts } from "@/components/home/trending-products";
import { TrustBand } from "@/components/home/trust-band";
import { VendorShowcase } from "@/components/home/vendor-showcase";
import { WhyChoose } from "@/components/home/why-choose";
import {
  getCategories,
  getProducts,
  getVendors,
} from "@/lib/catalogue";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const STORE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/photos/market-stall.jpg`,
  areaServed: "IN",
};

export default function HomePage() {
  const categories = getCategories();
  const vendors = getVendors();
  const products = getProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_JSON_LD) }}
      />

      <Hero />

      <CategoryStrip categories={categories} />

      <TrustBand />

      <Section>
        <VendorShowcase vendors={vendors} />
      </Section>

      <Section>
        <TrendingProducts products={products} />
      </Section>

      <Section>
        <FarmerBanner />
      </Section>

      <Section>
        <DietGrid />
      </Section>

      <WhyChoose />

      <Newsletter />
    </>
  );
}
