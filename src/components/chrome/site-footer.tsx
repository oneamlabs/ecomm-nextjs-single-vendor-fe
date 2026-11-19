import Link from "next/link";

const SHOP_LINKS = [
  { href: "/shop", label: "Everything" },
  { href: "/shop?category=pantry", label: "Pantry" },
  { href: "/shop?category=drinks", label: "Drinks" },
  { href: "/shop?category=fresh", label: "Fresh" },
];

/**
 * A flat, full-bleed band. The background runs edge to edge and the content
 * sits in the shared container, so the footer reads as the end of the page
 * rather than a floating card on top of it.
 */
export function SiteFooter() {
  return (
    <footer className="mt-[var(--section-gap-s)] border-t border-rule bg-paper-2">
      <div className="container py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
              Kraya
            </p>
            <p className="mt-5 max-w-[36ch] text-ink-2">
              A provisions shop. Everything is weighed, packed and labelled here.
            </p>
            <Link href="/shop" className="btn btn--primary mt-8">
              Shop the range
            </Link>
          </div>

          <nav aria-labelledby="footer-shop" className="md:col-span-3">
            <p id="footer-shop" className="text-sm font-semibold text-ink">
              Shop
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-quiet inline-flex min-h-11 items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p id="footer-visiting" className="text-sm font-semibold text-ink">
              Visiting
            </p>
            <dl aria-labelledby="footer-visiting" className="mt-4 space-y-3 text-sm text-ink-2">
              <div>
                <dt className="font-semibold text-ink">Address</dt>
                <dd className="mt-0.5">14 Row Street, Bristol BS1 4QA</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Hours</dt>
                <dd className="mt-0.5">Tuesday to Saturday, 8:00 to 18:00</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Orders</dt>
                <dd className="mt-0.5">Cut off at 11:00 for same-day delivery</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
          <Link
            href="/credits"
            className="link-quiet inline-flex min-h-11 items-center text-sm font-semibold"
          >
            Photographs and credits
          </Link>
          <p className="text-sm text-muted">
            A demo storefront. Prices are sample data, and no order is placed.
          </p>
        </div>
      </div>
    </footer>
  );
}
