import Link from "next/link";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { ProductPhoto } from "./product-photo";
import { QuickAdd } from "./quick-add";

const shelfTone: Record<string, string> = {
  pantry: "shelf-pantry",
  drinks: "shelf-drinks",
  fresh: "shelf-fresh",
};

const shelfLabel: Record<string, string> = {
  pantry: "Pantry",
  drinks: "Drinks",
  fresh: "Fresh",
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}

/**
 * A card rather than a flat block: the photograph sits in a tinted well and the
 * card carries its own surface and hairline, so a grid of these reads as objects
 * on the page instead of photos dropped onto it.
 */
export function ProductCard({
  product,
  priority = false,
  compact = false,
}: ProductCardProps) {
  const prices = product.variants.map((variant) => variant.priceCents);
  const lowest = Math.min(...prices);
  const soldOut = product.variants.every((variant) => !variant.inStock);
  const defaultVariant =
    product.variants.find((variant) => variant.inStock) ?? product.variants[0];
  const tone = shelfTone[product.categoryId] ?? "bg-paper-2";
  const packs = product.variants.map((variant) => variant.label).join(" · ");
  const per100 = Math.round(
    (defaultVariant.priceCents / defaultVariant.netAmount) * 100,
  );
  const labels = [
    ...(product.organic ? ["Organic"] : []),
    ...product.tags.map(tagLabel),
  ];
  const categoryName = shelfLabel[product.categoryId];

  return (
    <article className="group lift flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-paper shadow-card ring-1 ring-rule">
      <div className={`relative ${tone}`}>
        <Link href={`/shop/${product.id}`} className="block">
          <ProductPhoto
            photoKey={product.photo}
            alt={product.photoAlt}
            sizes={
              compact
                ? "(min-width: 80rem) 16vw, (min-width: 64rem) 20vw, (min-width: 40rem) 42vw, 72vw"
                : "(min-width: 64rem) 23vw, (min-width: 40rem) 42vw, 72vw"
            }
            priority={priority}
            className={`rounded-none shadow-none transition-transform duration-500 group-hover:scale-[1.03] ${
              compact ? "aspect-[16/10]" : "aspect-[4/3]"
            }`}
          />
        </Link>

        {categoryName && (
          <span className="tag absolute left-3 top-3 shadow-card">{categoryName}</span>
        )}

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} name={product.name} />
        </div>

        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/85 py-1.5 text-center text-sm font-semibold text-paper">
            Sold out
          </span>
        )}
      </div>

      <Link
        href={`/shop/${product.id}`}
        className={`flex flex-1 flex-col pt-3 ${compact ? "px-3" : "px-4"}`}
      >
        <p className="text-sm text-muted">{product.origin}</p>
        <h3
          className={`mt-1 min-h-[2.1em] leading-snug ${compact ? "text-lg" : "text-[length:var(--text-title)]"}`}
        >
          {product.name}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <p className={`num font-semibold text-ink ${compact ? "text-md" : "text-lg"}`}>
            from {formatPrice(lowest)}
          </p>
          <p className="num text-sm text-muted">
            {formatPrice(per100)} / 100 {defaultVariant.netUnit}
          </p>
        </div>

        {/* The rail needs the pack list to price-scan; a related-product
            carousel on a product page does not, and the extra lines are what
            make a compact card stop being compact. */}
        {!compact && (
          <>
            <p className="mt-1.5 line-clamp-2 text-sm text-ink-2">{packs}</p>
            <p className="mt-1 text-sm text-muted">{labels.join(" · ")}</p>
          </>
        )}
      </Link>

      <div className={`mt-auto flex pt-3 ${compact ? "px-3 pb-3" : "px-4 pb-4"}`}>
        <QuickAdd
          productId={product.id}
          variantId={defaultVariant.id}
          name={product.name}
          label={defaultVariant.label}
          priceCents={defaultVariant.priceCents}
          soldOut={soldOut}
          compact={compact}
        />
      </div>
    </article>
  );
}

function tagLabel(tag: string) {
  return tag === "gluten-free" ? "Gluten-free" : tag.charAt(0).toUpperCase() + tag.slice(1);
}
