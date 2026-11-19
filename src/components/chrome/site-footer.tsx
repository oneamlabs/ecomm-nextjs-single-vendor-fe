import Link from "next/link";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LeafIcon,
  LinkedinLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

const SHOP_LINKS = [
  { href: "/shop", label: "All Categories" },
  { href: "/shop", label: "Organic Foods" },
  { href: "/shop?category=snacks", label: "Healthy Snacks" },
  { href: "/shop?category=grains", label: "Grains & Pulses" },
  { href: "/shop?category=oils", label: "Oils & Ghee" },
  { href: "/shop?category=beverages", label: "Beverages" },
  { href: "/shop?category=combos", label: "Combo Deals" },
];

const SELLER_LINKS = [
  { href: "/sell", label: "Become a Seller" },
  { href: "/account", label: "Seller Login" },
  { href: "/sell", label: "Seller Guide" },
  { href: "/sell", label: "Commission & Fees" },
  { href: "/sell", label: "Seller Support" },
];

const HELP_LINKS = [
  { href: "/checkout", label: "Track Your Order" },
  { href: "/policies", label: "Returns & Refunds" },
  { href: "/policies", label: "FAQs" },
  { href: "/policies", label: "Contact Us" },
  { href: "/policies", label: "Payment Options" },
];

const ABOUT_LINKS = [
  { href: "/policies", label: "About Us" },
  { href: "/vendors", label: "Our Farmers" },
  { href: "/policies", label: "Sustainability" },
  { href: "/policies", label: "Careers" },
  { href: "/policies", label: "Blog" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramLogoIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookLogoIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YoutubeLogoIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinLogoIcon },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest text-paper">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-full bg-paper/10 text-paper">
                <LeafIcon size={24} weight="fill" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold tracking-[-0.02em]">
                  Kraya
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/60">
                  Pure Food · Trusted Farmers
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-paper/70">
              A multi-vendor marketplace for authentic, chemical-free packaged
              food. Supporting farmers, nourishing families.
            </p>

            <ul className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-paper/20 text-paper/80 transition hover:border-paper/50 hover:bg-paper/10 hover:text-paper"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="For Sellers" links={SELLER_LINKS} />
          <FooterColumn title="Help & Support" links={HELP_LINKS} />
          <FooterColumn title="About Kraya" links={ABOUT_LINKS} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-paper/15 pt-6 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Kraya. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href="/policies" className="transition hover:text-paper">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/policies" className="transition hover:text-paper">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/policies" className="transition hover:text-paper">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-labelledby={`footer-${title}`} className="lg:col-span-2">
      <p
        id={`footer-${title}`}
        className="text-sm font-semibold text-paper"
      >
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="inline-flex min-h-6 items-center transition hover:text-paper"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
