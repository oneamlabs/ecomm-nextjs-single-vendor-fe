"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartCount } from "@/components/cart/cart-count";
import { WishlistCount } from "@/components/wishlist/wishlist-count";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=drinks", label: "Drinks" },
  { href: "/shop?category=fresh", label: "Fresh" },
  { href: "/shop?tag=vegan", label: "Vegan" },
  { href: "/wishlist", label: "Saved" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const menuOpen = menuOpenFor === pathname;

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
          <div className="flex h-16 items-center gap-2 md:h-[var(--nav-height)] md:gap-4">
            <Link
              href="/"
              aria-label="Kraya, home"
              onClick={() => setMenuOpenFor(null)}
              className="font-display text-base font-bold tracking-[-0.03em] md:text-lg"
            >
              Kraya
            </Link>

            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-1 text-sm">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3.5 py-2 transition-colors duration-200 hover:bg-paper-2 ${
                          active ? "bg-paper-2 text-ink" : "text-ink-2"
                        }`}
                      >
                        {link.label}
                        {link.href === "/wishlist" && <WishlistCount />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/basket"
                onClick={() => setMenuOpenFor(null)}
                className="btn min-h-11 gap-2 px-2.5 text-sm md:px-4"
              >
                Basket
                <CartCount />
              </Link>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpenFor(menuOpen ? null : pathname)}
                className="btn min-h-11 px-2.5 text-sm md:hidden"
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>

          <nav
            id="mobile-menu"
            aria-label="Main, compact"
            hidden={!menuOpen}
            className="border-t border-rule py-3 md:hidden"
          >
            <ul className="grid gap-1 text-sm">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpenFor(null)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center justify-between rounded-[var(--radius-pill)] px-3 py-2.5 ${
                        active ? "bg-paper-2 text-ink" : "text-ink-2 hover:bg-paper-2"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.href === "/wishlist" && <WishlistCount />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
