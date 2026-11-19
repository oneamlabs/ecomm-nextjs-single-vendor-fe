"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CaretDownIcon,
  HeartIcon,
  LeafIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { CartCount } from "@/components/cart/cart-count";
import { WishlistCount } from "@/components/wishlist/wishlist-count";
import type { Category } from "@/lib/types";

const PRIMARY_LINKS = [
  { href: "/vendors", label: "Shop by Vendor" },
  { href: "/shop", label: "Organic Foods" },
  { href: "/shop?category=snacks", label: "Healthy Snacks" },
  { href: "/shop?category=grains", label: "Grains & Pulses" },
  { href: "/shop?category=oils", label: "Oils & Ghee" },
  { href: "/shop?category=beverages", label: "Beverages" },
  { href: "/shop?category=combos", label: "Combo Deals" },
];

interface HeaderClientProps {
  categories: Category[];
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoriesOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!categoriesRef.current?.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCategoriesOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [categoriesOpen]);

  return (
    <header>
      <div className="sticky top-0 z-[var(--z-sticky-nav)] border-b border-rule bg-paper/95 backdrop-blur">
        <div className="container flex h-[72px] items-center gap-3 lg:gap-6">
          <Link
            href="/"
            aria-label="Kraya, home"
            className="flex shrink-0 items-center gap-2"
          >
            <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
              <LeafIcon size={24} weight="fill" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
                Kraya
              </span>
              <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                Pure Food · Trusted Farmers
              </span>
            </span>
          </Link>

          <search className="hidden min-w-0 flex-1 lg:block">
            <form action="/shop" method="get" className="flex items-stretch">
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <input
                id="site-search"
                type="search"
                name="q"
                placeholder="Search for organic snacks, grains, oils..."
                className="h-10 w-full min-w-0 rounded-l-[var(--radius-sm)] border border-r-0 border-rule-strong bg-paper-2/60 px-4 text-sm text-ink outline-none transition focus:border-accent focus:bg-paper focus:ring-2 focus:ring-accent-line"
              />
              <button
                type="submit"
                aria-label="Search"
                className="btn btn--primary h-10 min-h-10 rounded-l-none px-4"
              >
                <MagnifyingGlassIcon size={18} weight="bold" aria-hidden="true" />
              </button>
            </form>
          </search>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <span className="hidden items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-xs text-ink-2 xl:flex">
              <MapPinIcon size={18} className="text-accent" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] text-muted">Deliver to</span>
                <span className="font-semibold text-ink">New Delhi 110001</span>
              </span>
            </span>

            <Link
              href="/account"
              className="hidden items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-xs text-ink-2 transition hover:bg-accent-soft hover:text-ink md:flex"
            >
              <UserIcon size={20} aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] text-muted">Account</span>
                <span className="font-semibold text-ink">Sign In / Register</span>
              </span>
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex min-h-11 items-center gap-1.5 rounded-[var(--radius-sm)] px-2 text-xs font-semibold text-ink-2 transition hover:bg-accent-soft hover:text-ink"
            >
              <HeartIcon size={22} aria-hidden="true" />
              <span className="hidden sm:inline">Wishlist</span>
              <span className="absolute -right-1 -top-1 sm:static">
                <WishlistCount />
              </span>
            </Link>

            <Link
              href="/basket"
              aria-label="Cart"
              className="relative flex min-h-11 items-center gap-1.5 rounded-[var(--radius-sm)] px-2 text-xs font-semibold text-ink-2 transition hover:bg-accent-soft hover:text-ink"
            >
              <ShoppingCartIcon size={22} aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -right-1 -top-1 sm:static">
                <CartCount />
              </span>
            </Link>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
              className="btn btn--ghost ml-1 min-h-11 px-3 md:hidden"
            >
              {menuOpen ? (
                <XIcon size={20} aria-hidden="true" />
              ) : (
                <ListIcon size={20} aria-hidden="true" />
              )}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        <search className="container block pb-3 lg:hidden">
          <form action="/shop" method="get" className="flex items-stretch">
            <label htmlFor="site-search-mobile" className="sr-only">
              Search products
            </label>
            <input
              id="site-search-mobile"
              type="search"
              name="q"
              placeholder="Search organic snacks, grains, oils..."
              className="h-10 w-full min-w-0 rounded-l-[var(--radius-sm)] border border-r-0 border-rule-strong bg-paper-2/60 px-3 text-sm text-ink outline-none focus:border-accent focus:bg-paper"
            />
            <button
              type="submit"
              aria-label="Search"
              className="btn btn--primary h-10 min-h-10 rounded-l-none px-4"
            >
              <MagnifyingGlassIcon size={18} weight="bold" aria-hidden="true" />
            </button>
          </form>
        </search>
      </div>

      <div className="hidden border-b border-rule bg-paper md:block">
        <div className="container flex h-[52px] items-center gap-2">
          <div ref={categoriesRef} className="relative shrink-0">
            <button
              type="button"
              aria-expanded={categoriesOpen}
              aria-controls="category-menu"
              onClick={() => setCategoriesOpen((value) => !value)}
              className="btn btn--primary hidden min-h-10 gap-2 px-4 md:inline-flex"
            >
              <ListIcon size={18} weight="bold" aria-hidden="true" />
              All Categories
              <CaretDownIcon size={14} weight="bold" aria-hidden="true" />
            </button>

            {categoriesOpen && (
              <div
                id="category-menu"
                className="absolute left-0 top-[calc(100%+8px)] z-[var(--z-dropdown)] w-64 overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper p-2 shadow-lift"
              >
                <ul className="grid">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/shop?category=${category.id}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex min-h-10 items-center justify-between gap-3 rounded-[var(--radius-sm)] px-3 text-sm text-ink-2 transition hover:bg-accent-soft hover:text-ink"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesOpen(false)}
                      className="flex min-h-10 items-center justify-between gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-semibold text-accent transition hover:bg-accent-soft"
                    >
                      New Arrivals
                      <span className="tag">New</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <nav aria-label="Main" className="hidden min-w-0 flex-1 md:block">
            <ul className="flex items-center gap-0.5 overflow-x-auto [scrollbar-width:none] xl:gap-1 [&::-webkit-scrollbar]:hidden">
              {PRIMARY_LINKS.map((link) => {
                const [path] = link.href.split("?");
                const active = pathname === path && link.href !== "/vendors";

                return (
                  <li key={link.href} className="shrink-0">
                    <Link
                      href={link.href}
                      aria-current={active && link.href === "/shop" ? "page" : undefined}
                      className={`inline-flex h-[52px] items-center border-b-2 px-2.5 text-sm transition-colors ${
                        active && link.href === "/shop"
                          ? "border-accent font-semibold text-ink"
                          : "border-transparent text-ink-2 hover:text-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/sell"
            className="btn btn--outline ml-auto hidden h-9 min-h-9 shrink-0 px-3 text-xs md:inline-flex"
          >
            Become a Seller
          </Link>
        </div>
      </div>

      <div hidden={!menuOpen} className="border-b border-rule bg-paper md:hidden">
        <nav
          id="mobile-menu"
          aria-label="Main, compact"
          className="container py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Shop
          </p>
          <ul className="mt-2 grid gap-0.5">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-2 text-sm text-ink-2 hover:bg-accent-soft hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Categories
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-0.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-2 text-sm text-ink-2 hover:bg-accent-soft hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2 border-t border-rule pt-4">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="btn btn--ghost flex-1 text-xs"
            >
              Sign In
            </Link>
            <Link
              href="/sell"
              onClick={() => setMenuOpen(false)}
              className="btn btn--outline flex-1 text-xs"
            >
              Become a Seller
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
