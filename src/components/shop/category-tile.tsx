import Link from "next/link";
import { CaretRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { formatPrice } from "@/lib/money";
import type { Category, Product } from "@/lib/types";
import { ProductPhoto } from "@/components/product/product-photo";

interface CategoryTileProps {
  category: Category;
  products: Product[];
  /** The first tile spans two columns and stands taller. */
  size?: "small" | "large";
}

function lowestPrice(products: Product[]) {
  return Math.min(
    ...products.flatMap((product) =>
      product.variants.map((variant) => variant.priceCents),
    ),
  );
}

function sizingFor(size: "small" | "large") {
  if (size === "large") {
    return {
      box: "min-h-[15rem] sm:min-h-[19rem]",
      name: "text-[length:var(--text-section-s)]",
      sizes: "(min-width: 64rem) 50vw, 100vw",
    };
  }
  return {
    box: "min-h-[13rem] sm:min-h-[15rem]",
    name: "text-[length:var(--text-title)]",
    sizes: "(min-width: 64rem) 25vw, 50vw",
  };
}

/**
 * A photo-led tile with its copy in a bottom-weighted scrim. The tile owns the
 * height and the photograph fills behind it, so the copy block can never cover
 * more of the image than the scrim it sits in.
 */
export function CategoryTile({ category, products, size = "small" }: CategoryTileProps) {
  if (products.length === 0) return null;

  const count = products.length;
  const origins = [...new Set(products.map((product) => product.origin))].slice(0, 2);
  const { box, name, sizes } = sizingFor(size);

  return (
    <Link
      href={`/shop?category=${category.id}`}
      aria-label={`Browse ${category.name.toLowerCase()}, ${count} ${
        count === 1 ? "item" : "items"
      }, from ${formatPrice(lowestPrice(products))}`}
      className={`group lift relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-ink shadow-card ${box}`}
    >
      <ProductPhoto
        photoKey={products[0].photo}
        alt=""
        sizes={sizes}
        className="absolute inset-0 h-full w-full rounded-none shadow-none"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/70 to-ink/20"
      />

      <div className="relative flex flex-col gap-2 p-5 text-paper">
        <p className="flex items-center gap-1.5 text-sm font-medium text-paper">
          <MapPinIcon size={13} weight="bold" aria-hidden="true" className="shrink-0" />
          <span className="truncate">{origins.join(" · ")}</span>
        </p>

        <div>
          <p className={`font-display font-bold leading-[1.05] tracking-[-0.03em] ${name}`}>
            {category.name}
          </p>
          <p className="mt-1 line-clamp-1 text-sm text-paper/90">{category.summary}</p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-paper/30 pt-2 text-sm">
          <span className="font-semibold text-paper">
            {count} {count === 1 ? "item" : "items"}
            <span className="font-normal text-paper/85">
              {" "}
              · from {formatPrice(lowestPrice(products))}
            </span>
          </span>

          <span className="inline-flex items-center gap-1 font-medium text-paper transition-colors">
            Browse
            <CaretRightIcon
              size={13}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
