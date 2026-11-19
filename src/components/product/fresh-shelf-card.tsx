import Link from "next/link";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/types";
import { ProductPhoto } from "@/components/product/product-photo";

interface FreshShelfCardProps {
  product: Product;
  /** The lead card spans two grid columns and shows a wider frame. */
  lead?: boolean;
}

/**
 * A fresh-shelf card that matches the product cards elsewhere: own surface,
 * hairline, and the photograph in a tinted well rather than a colour block.
 */
export function FreshShelfCard({ product, lead = false }: FreshShelfCardProps) {
  const lowest = Math.min(
    ...product.variants.map((variant) => variant.priceCents),
  );

  return (
    <Link
      href={`/shop/${product.id}`}
      className={`group lift flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-paper shadow-card ring-1 ring-rule ${
        lead ? "md:col-span-6" : "md:col-span-3"
      }`}
    >
      <div className="shelf-fresh">
        <ProductPhoto
          photoKey={product.photo}
          alt={product.photoAlt}
          sizes={lead ? "(min-width: 64rem) 50vw, 100vw" : "(min-width: 64rem) 24vw, 100vw"}
          className={`rounded-none shadow-none transition-transform duration-500 group-hover:scale-[1.03] ${
            lead ? "aspect-[16/10]" : "aspect-square"
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-muted">{product.origin}</p>
        <h3
          className={`mt-1 leading-snug ${
            lead ? "text-[length:var(--text-title)]" : "text-lg"
          }`}
        >
          {product.name}
        </h3>
        <p className="num mt-auto pt-4 text-sm font-semibold text-ink">
          from {formatPrice(lowest)}
        </p>
      </div>
    </Link>
  );
}
