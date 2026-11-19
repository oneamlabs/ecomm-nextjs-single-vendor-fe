"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { CartCount } from "@/components/cart/cart-count";
import { NavLinks, NavList, type NavLinkItem } from "./nav-links";

const links: NavLinkItem[] = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=drinks", label: "Drinks" },
  { href: "/shop?category=fresh", label: "Fresh" },
  { href: "/shop?tag=vegan", label: "Vegan" },
  { href: "/wishlist", label: "Saved" },
];

/**
 * The fallback renders the same list without a current item, so the header is
 * complete in the server HTML and nothing shifts when the query resolves.
 */
function NavFallback({ mobile = false }: { mobile?: boolean }) {
  return <NavList links={links} activeHref={null} mobile={mobile} />;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const menuOpen = menuOpenFor === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpenFor(null);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
  }, [menuOpen]);

  return (
    <>
      <aside aria-label="Delivery information" className="bg-accent text-accent-ink">
        <div className="container flex h-9 items-center justify-between gap-4 text-sm">
          <p className="truncate">Free delivery over £40. Weighed and packed here.</p>
          <p className="hidden shrink-0 sm:block">Orders before 11:00 go out the same day.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-[var(--z-sticky-nav)] border-b border-rule bg-paper">
        <div className="container">
          <div className="flex h-16 items-center gap-2 md:h-[var(--nav-height)] md:gap-6">
            <Link
              href="/"
              aria-label="Kraya, home"
              onClick={() => setMenuOpenFor(null)}
              className="inline-flex min-h-11 items-center font-display text-lg font-bold tracking-[-0.03em] md:text-xl"
            >
              Kraya
            </Link>

            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-1 text-sm">
                <Suspense fallback={<NavFallback />}>
                  <NavLinks links={links} />
                </Suspense>
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/basket"
                onClick={() => setMenuOpenFor(null)}
                className="btn btn--flat min-h-11 gap-2 px-3 text-sm md:px-4"
              >
                Basket
                <CartCount />
              </Link>
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpenFor(menuOpen ? null : pathname)}
                className="btn btn--flat min-h-11 px-3 text-sm md:hidden"
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>

          <nav
            ref={menuRef}
            id="mobile-menu"
            aria-label="Main, compact"
            hidden={!menuOpen}
            className="border-t border-rule py-3 md:hidden"
          >
            <ul className="grid gap-1 text-sm">
              <Suspense fallback={<NavFallback mobile />}>
                <NavLinks
                  links={links}
                  mobile
                  onNavigate={() => setMenuOpenFor(null)}
                />
              </Suspense>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
