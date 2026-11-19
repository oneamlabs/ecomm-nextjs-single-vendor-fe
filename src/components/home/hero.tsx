import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LeafIcon,
  PlayIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ProductPhoto } from "@/components/product/product-photo";

const PROOFS = ["100% Organic", "Quality Assured", "Pan-India Delivery"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent-soft/70 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-accent-soft/50 blur-3xl"
      />

      <div className="container relative">
        <div className="grid items-center gap-8 py-8 md:grid-cols-2 md:py-12 lg:gap-14 lg:py-14">
          <div className="max-w-[34rem]">
            <p className="eyebrow">From trusted producers</p>
            <h1 className="mt-3 text-[length:var(--text-display)] leading-[1.02] text-ink">
              Organic &amp;
              <br />
              Naturally Good
            </h1>
            <p className="mt-4 max-w-[44ch] text-md leading-relaxed text-ink-2">
              A multi-vendor marketplace for authentic, chemical-free packaged
              food, sourced directly from farmers we know.
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {PROOFS.map((proof) => (
                <li
                  key={proof}
                  className="flex items-center gap-1.5 text-sm font-medium text-ink-2"
                >
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-accent"
                    aria-hidden="true"
                  />
                  {proof}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn btn--primary">
                Shop Organic Now
                <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link
                href="#why-kraya"
                className="btn border-rule-strong bg-paper text-ink-2 hover:border-accent hover:text-accent"
              >
                <PlayIcon size={16} weight="fill" aria-hidden="true" />
                How It Works
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-6 rounded-full bg-accent" />
              <span className="size-1.5 rounded-full bg-rule-strong" />
              <span className="size-1.5 rounded-full bg-rule-strong" />
            </div>
          </div>

          <div className="relative">
            <ProductPhoto
              photoKey="market-stall"
              alt="A sunlit market stall under green canopies, with crates of produce"
              sizes="(min-width: 1024px) 46vw, 100vw"
              priority
              className="aspect-[5/4] w-full rounded-[var(--radius-lg)] shadow-none"
            />

            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-[var(--radius-md)] bg-paper/95 px-3 py-2 shadow-card backdrop-blur">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <LeafIcon size={20} weight="fill" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-bold text-ink">100% Organic</span>
                <span className="block text-[11px] text-muted">
                  No chemicals, no shortcuts
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
