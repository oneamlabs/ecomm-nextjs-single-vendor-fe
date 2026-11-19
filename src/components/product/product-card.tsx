import Link from "next/link";
import { defaultVariant, discountPercent } from "@/lib/variant";
import { getVendor } from "@/lib/vendors";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { ProductPhoto } from "./product-photo";
import { QuickAdd } from "./quick-add";
import { Rating } from "./rating";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  compact?: boolean;
  /** The catalogue card carries the default pack size. */
  showPack?: boolean;
  /** The catalogue card names the seller. */
  showVendor?: boolean;
}

/**
 * The marketplace card: a white framed surface, a square packshot, a discount
 * badge, a heart, the rating and a full-width Add to Cart.
 */
export function ProductCard({
  product,
  priority = false,
  compact = false,
  showPack = false,
  showVendor = false,
}: ProductCardProps) {
  const variant = defaultVariant(product);
  const soldOut = product.variants.every((item) => !item.inStock);
  const discount = discountPercent(product);
  const vendor = getVendor(product.vendorId);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper transition duration-300 hover:border-accent-line hover:shadow-lift">
      <div className={`relative bg-paper-2 ${compact ? "p-2.5" : "p-3"}`}>
        <Link href={`/shop/${product.id}`} aria-label={product.name}>
          <ProductPhoto
            photoKey={product.photo}
            alt={product.photoAlt}
            sizes={
              compact
                ? "(min-width: 96rem) 15vw, (min-width: 80rem) 16vw, (min-width: 64rem) 20vw, (min-width: 40rem) 42vw, 45vw"
                : "(min-width: 80rem) 18vw, (min-width: 64rem) 20vw, (min-width: 40rem) 30vw, 45vw"
            }
            priority={priority}
            className="aspect-square rounded-[var(--radius-sm)] shadow-none transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        {discount !== undefined && (
          <span className="absolute left-2.5 top-2.5 rounded-[var(--radius-sm)] bg-accent px-1.5 py-0.5 text-[11px] font-bold leading-tight text-accent-ink">
            -{discount}%
          </span>
        )}

        <div className="absolute right-2.5 top-2.5">
          <WishlistButton productId={product.id} name={product.name} />
        </div>

        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-center text-xs font-semibold text-paper">
            Sold out
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-2.5 pt-2" : "p-3 pt-2.5"}`}>
        <Link
          href={`/shop/${product.id}`}
          className={`line-clamp-2 min-h-[2.6em] font-semibold leading-snug text-ink transition-colors hover:text-accent ${
            compact ? "text-sm" : "text-[0.9375rem]"
          }`}
        >
          {product.name}
        </Link>

        {showPack && (
          <p className="mt-1 text-xs text-muted">{variant.label}</p>
        )}

        <Rating
          rating={product.rating}
          reviewCount={product.reviewCount}
          className="mt-1"
        />

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-base font-bold text-ink">
            {formatPrice(variant.priceCents)}
          </span>
          {product.mrpCents !== undefined && product.mrpCents > variant.priceCents && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.mrpCents)}
            </span>
          )}
        </div>

        {showVendor && vendor && (
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-accent">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="size-3.5 shrink-0"
            >
              <path d="M10 2c3.5 2.2 5.6 5.3 5.6 9.1 0 3-2.4 5.4-5.6 6.9-3.2-1.5-5.6-3.9-5.6-6.9C4.4 7.3 6.5 4.2 10 2zm0 3.2c-1.9 1.5-3 3.5-3 5.9 0 1.7 1.2 3.1 3 4.1 1.8-1 3-2.4 3-4.1 0-2.4-1.1-4.4-3-5.9z" />
            </svg>
            {vendor.name}
          </p>
        )}

        <div className="mt-auto pt-3">
          <QuickAdd
            productId={product.id}
            variantId={variant.id}
            name={product.name}
            label={variant.label}
            priceCents={variant.priceCents}
            soldOut={soldOut}
            compact={compact}
          />
        </div>
      </div>
    </article>
  );
}
