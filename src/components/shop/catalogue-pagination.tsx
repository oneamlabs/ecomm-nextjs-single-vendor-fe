import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { buildShopHref, type ShopQuery } from "@/lib/shop-query";

interface CataloguePaginationProps {
  page: number;
  pageCount: number;
  query: ShopQuery;
}

type PageEntry =
  | { kind: "page"; value: number }
  | { kind: "ellipsis"; id: number };

export function CataloguePagination({
  page,
  pageCount,
  query,
}: CataloguePaginationProps) {
  if (pageCount <= 1) return null;

  const pages = pageNumbers(page, pageCount);

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link
          href={buildShopHref(query, { page: page - 1 })}
          className="btn btn--ghost h-9 min-h-9 px-3 text-xs"
          aria-label="Previous page"
        >
          <CaretLeftIcon size={14} weight="bold" aria-hidden="true" />
          Prev
        </Link>
      ) : (
        <DisabledPageControl>
          <CaretLeftIcon size={14} weight="bold" aria-hidden="true" />
          Prev
        </DisabledPageControl>
      )}

      {pages.map((entry) =>
        entry.kind === "ellipsis" ? (
          <span key={`ellipsis-${entry.id}`} className="px-2 text-sm text-muted">
            …
          </span>
        ) : (
          <Link
            key={entry.value}
            href={buildShopHref(query, { page: entry.value })}
            aria-current={entry.value === page ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-[var(--radius-sm)] border text-sm ${
              entry.value === page
                ? "border-accent bg-accent font-semibold text-accent-ink"
                : "border-rule bg-paper text-ink-2 hover:border-accent-line hover:text-accent"
            }`}
          >
            {entry.value}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link
          href={buildShopHref(query, { page: page + 1 })}
          className="btn btn--ghost h-9 min-h-9 px-3 text-xs"
          aria-label="Next page"
        >
          Next
          <CaretRightIcon size={14} weight="bold" aria-hidden="true" />
        </Link>
      ) : (
        <DisabledPageControl>
          Next
          <CaretRightIcon size={14} weight="bold" aria-hidden="true" />
        </DisabledPageControl>
      )}
    </nav>
  );
}

/**
 * A disabled page control is a `<span>`, not a link, so it cannot be reached by
 * keyboard or announced as actionable. It keeps the full muted text colour
 * rather than fading it: contrast must still pass at 4.5:1, and a disabled
 * control a user cannot read is worse than one that looks slightly bright.
 */
function DisabledPageControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      aria-disabled="true"
      className="inline-flex h-9 min-h-9 items-center gap-1 rounded-[var(--radius-sm)] border border-rule bg-paper px-3 text-xs font-semibold text-muted"
    >
      {children}
    </span>
  );
}

function pageNumbers(page: number, pageCount: number): PageEntry[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => ({
      kind: "page" as const,
      value: index + 1,
    }));
  }

  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((item) => item >= 1 && item <= pageCount)
    .toSorted((a, b) => a - b);

  const result: PageEntry[] = [];
  for (const value of sorted) {
    const previous = result[result.length - 1];
    if (previous?.kind === "page" && value - previous.value > 1) {
      result.push({ kind: "ellipsis", id: value });
    }
    result.push({ kind: "page", value });
  }
  return result;
}
