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
    <article className="group lift flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[var(--radius-lg)] ${tone}`}>
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
            className={`rounded-none shadow-none transition-transform duration-500 group-hover:scale-[1.02] ${
              compact ? "aspect-[16/10]" : "aspect-[4/3]"
            }`}
          />
        </Link>

        {categoryName && (
          <span className="tag absolute left-3 top-3">{categoryName}</span>
        )}

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} name={product.name} />
        </div>
      </div>

      <Link
        href={`/shop/${product.id}`}
        className="flex flex-1 flex-col px-1 pt-3"
      >
        <p className="text-sm text-muted">{product.origin}</p>
        <h3
          className={`mt-1 leading-snug ${compact ? "text-xl" : "text-title"}`}
        >
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <p className="num text-lg font-semibold text-ink">
            from {formatPrice(lowest)}
          </p>
          <p className="num text-sm text-muted">
            {formatPrice(per100)} / 100 {defaultVariant.netUnit}
          </p>
        </div>

        <p className="mt-2 text-sm text-ink-2">{packs}</p>
        <p className="mt-1 text-sm text-muted">{labels.join(" · ")}</p>

        {soldOut && <p className="mt-auto pt-2 text-sm text-muted">Sold out</p>}
      </Link>

      <div className="mt-3 flex px-1">
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
