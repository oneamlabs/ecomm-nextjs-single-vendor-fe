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

interface CompactProductCardProps {
  product: Product;
}

export function CompactProductCard({ product }: CompactProductCardProps) {
  const prices = product.variants.map((variant) => variant.priceCents);
  const lowest = Math.min(...prices);
  const soldOut = product.variants.every((variant) => !variant.inStock);
  const defaultVariant = product.variants.find((variant) => variant.inStock) ?? product.variants[0];
  const tone = shelfTone[product.categoryId] ?? "bg-paper-2";
  const packs = product.variants.map((variant) => variant.label).join(", ");

  return (
    <article className="flex min-w-0 items-center gap-3 py-3">
      <Link href={`/shop/${product.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <div className={`w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] p-1 ${tone}`}>
          <ProductPhoto
            photoKey={product.photo}
            alt={product.photoAlt}
            sizes="80px"
            className="aspect-square rounded-none shadow-none"
          />
        </div>

        <div className="min-w-0">
          <h4 className="m-0 font-body text-md font-semibold leading-snug">
            {product.name}
          </h4>
          <p className="mt-0.5 truncate text-sm text-muted">{product.origin}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">{packs}</p>
          <p className="num mt-1 text-sm font-semibold text-ink">
            from {formatPrice(lowest)}
          </p>
          {soldOut && <p className="mt-0.5 text-sm text-muted">Sold out</p>}
        </div>
      </Link>

      <div className="flex shrink-0 flex-col gap-1">
        <QuickAdd
          productId={product.id}
          variantId={defaultVariant.id}
          name={product.name}
          label={defaultVariant.label}
          priceCents={defaultVariant.priceCents}
          soldOut={soldOut}
          compact
        />
        <WishlistButton productId={product.id} name={product.name} />
      </div>
    </article>
  );
}
