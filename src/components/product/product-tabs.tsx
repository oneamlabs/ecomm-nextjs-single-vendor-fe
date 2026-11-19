"use client";

import Link from "next/link";
import {
  CookingPotIcon,
  GrainsIcon,
  HeartbeatIcon,
  LeafIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { ProductPhoto } from "@/components/product/product-photo";
import { Rating } from "@/components/product/rating";
import { ReviewsSection } from "@/components/product/reviews-section";
import type { Product, ProductDetail, ProductReview, Vendor } from "@/lib/types";

const FEATURE_ICONS = [LeafIcon, HeartbeatIcon, GrainsIcon, CookingPotIcon];

interface ProductTabsProps {
  product: Product;
  detail: ProductDetail;
  vendor?: Vendor;
  reviews: ProductReview[];
}

export function ProductTabs({
  product,
  detail,
  vendor,
  reviews,
}: ProductTabsProps) {
  const tabs = [
    { id: "description", label: "Description" },
    { id: "nutrition", label: "Nutrition Facts" },
    { id: "ingredients", label: "Ingredients" },
    { id: "how-to-use", label: "How to Use" },
    { id: "reviews", label: `Reviews (${product.reviewCount ?? 0})` },
    { id: "seller", label: "Seller Info" },
  ];
  const [active, setActive] = useState("description");

  return (
    <section className="min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex w-full min-w-0 overflow-x-auto border-b border-rule px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm transition ${
              active === tab.id
                ? "border-accent font-semibold text-accent"
                : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="p-4 sm:p-5">
        {active === "description" && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                About This Product
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {detail.longDescription}
              </p>

              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {detail.features.map((feature, index) => {
                  const Icon = FEATURE_ICONS[index] ?? LeafIcon;

                  return (
                    <li key={feature.title} className="flex gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <Icon size={18} weight="duotone" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {feature.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-muted">
                          {feature.line}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="overflow-hidden rounded-[var(--radius-md)] bg-paper-2">
              <ProductPhoto
                photoKey="market-stall"
                alt="Fresh produce and pantry ingredients in a market setting"
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="aspect-[4/3] w-full rounded-none shadow-none"
              />
            </div>
          </div>
        )}

        {active === "nutrition" && (
          <div className="max-w-xl">
            <h2 className="font-body text-lg font-bold text-ink">Nutrition Facts</h2>
            <table className="mt-3 w-full border-collapse text-sm">
              <caption className="sr-only">
                Nutrition information for {product.name}
              </caption>
              <tbody>
                {detail.nutrition.map((row) => (
                  <tr key={row.label} className="border-b border-rule-2 last:border-b-0">
                    <th scope="row" className="py-2 text-left font-medium text-ink-2">
                      {row.label}
                    </th>
                    <td className="num py-2 text-right text-ink">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted">
              Sample values per 100 g. Check the pack label for the product you receive.
            </p>
          </div>
        )}

        {active === "ingredients" && (
          <div className="max-w-[60ch]">
            <h2 className="font-body text-lg font-bold text-ink">Ingredients</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              {detail.ingredients}
            </p>
            <p className="mt-3 text-xs text-muted">
              Packed in a facility that also handles nuts and cereals.
            </p>
          </div>
        )}

        {active === "how-to-use" && (
          <div className="max-w-[60ch]">
            <h2 className="font-body text-lg font-bold text-ink">How to Use</h2>
            <ol className="mt-3 grid gap-2 text-sm text-ink-2">
              {detail.howToUse.map((step, index) => (
                <li key={step} className="flex gap-2.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {active === "reviews" && (
          <ReviewsSection
            productName={product.name}
            rating={product.rating ?? 0}
            reviewCount={product.reviewCount ?? 0}
            reviews={reviews}
            plain
          />
        )}

        {active === "seller" && (
          <div className="max-w-[60ch]">
            <h2 className="font-body text-lg font-bold text-ink">Seller Information</h2>
            {vendor ? (
              <div className="mt-3">
                <p className="text-sm font-semibold text-ink">{vendor.name}</p>
                <p className="mt-0.5 text-xs text-muted">{vendor.location}</p>
                <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} className="mt-1" />
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {vendor.summary}
                </p>
                <Link
                  href={`/shop?vendor=${vendor.id}`}
                  className="btn btn--outline mt-3 min-h-9 text-xs"
                >
                  View store
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-2">
                Seller information is not available for this demo product.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
