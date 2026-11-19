import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-[var(--section-gap-s)]">
      <div className="container">
        <div className="rounded-[var(--radius-lg)] bg-paper-2 p-8 md:p-14">
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

            <nav aria-label="Footer" className="md:col-span-3">
              <h2 className="font-body text-sm font-semibold text-ink tracking-normal leading-normal">Shop</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
                <li>
                  <Link href="/shop" className="link-quiet inline-flex min-h-11 items-center">
                    Everything
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=pantry"
                    className="link-quiet inline-flex min-h-11 items-center"
                  >
                    Pantry
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=drinks"
                    className="link-quiet inline-flex min-h-11 items-center"
                  >
                    Drinks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=fresh"
                    className="link-quiet inline-flex min-h-11 items-center"
                  >
                    Fresh
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="md:col-span-3">
              <h2 className="font-body text-sm font-semibold text-ink tracking-normal leading-normal">Visiting</h2>
              <dl className="mt-4 space-y-2.5 text-sm text-ink-2">
                <div>
                  <dt className="inline font-semibold text-ink">Address: </dt>
                  <dd className="inline">14 Row Street, Bristol BS1 4QA</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-ink">Hours: </dt>
                  <dd className="inline">Tuesday to Saturday, 8:00 to 18:00</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-ink">Orders: </dt>
                  <dd className="inline">Cut off at 11:00 for same-day delivery</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
            <Link
              href="/credits"
              className="link-quiet inline-flex min-h-11 items-center text-sm font-semibold"
            >
              Photographs and credits
            </Link>
            <p className="text-xs text-muted">
              A demo storefront. Prices are sample data, and no order is placed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
