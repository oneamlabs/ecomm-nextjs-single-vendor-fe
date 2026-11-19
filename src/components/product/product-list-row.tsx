import Link from "next/link";
import { defaultVariant, discountPercent, getVendor } from "@/lib/catalogue";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { ProductPhoto } from "./product-photo";
import { QuickAdd } from "./quick-add";
import { Rating } from "./rating";

export function ProductListRow({ product }: { product: Product }) {
  const variant = defaultVariant(product);
  const soldOut = product.variants.every((item) => !item.inStock);
  const discount = discountPercent(product);
  const vendor = getVendor(product.vendorId);

  return (
    <article className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-rule bg-paper p-3 transition hover:border-accent-line hover:shadow-card sm:flex-row sm:items-center">
      <div className="relative w-full shrink-0 sm:w-32">
        <Link href={`/shop/${product.id}`} aria-label={product.name}>
          <ProductPhoto
            photoKey={product.photo}
            alt={product.photoAlt}
            sizes="128px"
            className="aspect-square rounded-[var(--radius-sm)] shadow-none"
          />
        </Link>
        {discount !== undefined && (
          <span className="absolute left-1.5 top-1.5 rounded-[var(--radius-sm)] bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-ink">
            -{discount}%
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/shop/${product.id}`}
          className="font-semibold text-ink transition-colors hover:text-accent"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-muted">{variant.label}</p>
        <Rating rating={product.rating} reviewCount={product.reviewCount} className="mt-1" />
        {vendor && (
          <p className="mt-1 text-xs font-medium text-accent">{vendor.name}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:w-48 sm:items-end">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-ink">
            {formatPrice(variant.priceCents)}
          </span>
          {product.mrpCents !== undefined && product.mrpCents > variant.priceCents && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.mrpCents)}
            </span>
          )}
        </div>
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            <QuickAdd
              productId={product.id}
              variantId={variant.id}
              name={product.name}
              label={variant.label}
              priceCents={variant.priceCents}
              soldOut={soldOut}
              compact
            />
          </div>
          <WishlistButton productId={product.id} name={product.name} />
        </div>
      </div>
    </article>
  );
}
