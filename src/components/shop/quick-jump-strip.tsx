import Image from "next/image";
import Link from "next/link";
import { getPhoto } from "@/lib/photos";
import type { Category, Product } from "@/lib/types";

interface QuickJumpStripProps {
  shelves: { category: Category; allProducts: Product[] }[];
}

/**
 * A circular-photo shortcut row that sits directly under the hero, the way a
 * marketplace puts its ranges one tap from the fold. The photographs come from
 * the shelf's own first product, so a chip cannot point at imagery the
 * catalogue does not serve.
 *
 * Chips are real categories only. A diet tag is a filter rather than a
 * destination, and putting both in one row makes the row mean two things.
 */
export function QuickJumpStrip({ shelves }: QuickJumpStripProps) {
  if (shelves.length === 0) return null;

  return (
    <nav aria-label="Jump to a shelf" className="bg-paper">
      <div className="container">
        <ul className="flex gap-1 overflow-x-auto py-4 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
          {shelves.map(({ category, allProducts }) => {
            if (allProducts.length === 0) return null;
            const photo = getPhoto(allProducts[0].photo);

            return (
              <li key={category.id} className="shrink-0">
                <Link
                  href={`/shop?category=${category.id}`}
                  className="group flex w-24 flex-col items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 transition-colors hover:bg-paper-2 sm:w-28"
                >
                  <span className="size-16 overflow-hidden rounded-full bg-paper-2 ring-1 ring-rule transition-transform duration-300 group-hover:scale-105 sm:size-[4.5rem]">
                    <Image
                      src={photo.src}
                      alt=""
                      width={photo.width}
                      height={photo.height}
                      sizes="72px"
                      className="size-full object-cover"
                    />
                  </span>
                  <span className="text-center text-sm font-medium text-ink-2 transition-colors group-hover:text-ink">
                    {category.name}
                  </span>
                </Link>
              </li>
            );
          })}

          <li className="shrink-0">
            <Link
              href="/shop"
              className="group flex w-24 flex-col items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 transition-colors hover:bg-paper-2 sm:w-28"
            >
              <span className="flex size-16 items-center justify-center rounded-full border border-dashed border-rule-strong text-sm font-semibold text-ink-2 transition-colors group-hover:text-ink sm:size-[4.5rem]">
                All
              </span>
              <span className="text-center text-sm font-medium text-ink-2 transition-colors group-hover:text-ink">
                Everything
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
