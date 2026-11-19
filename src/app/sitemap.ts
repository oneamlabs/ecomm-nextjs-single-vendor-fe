import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalogue";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/credits`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...getProducts().map((product) => ({
      url: `${SITE_URL}/shop/${product.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
