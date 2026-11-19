import Image from "next/image";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { getPhoto } from "@/lib/photos";

const PROOFS = ["100% Organic", "Quality Assured", "Pan-India Delivery"];

export function CatalogueHero() {
  const photo = getPhoto("apples-crate");

  return (
    <section className="container pt-4" aria-labelledby="catalogue-hero-title">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-accent-soft">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">Explore our range</p>
            <p
              id="catalogue-hero-title"
              className="mt-2 max-w-[18ch] font-display text-[clamp(1.9rem,3vw,2.75rem)] font-bold leading-[1.05] text-ink"
            >
              All Organic Products
            </p>
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-2">
              Discover our complete range of chemical-free, farm-sourced food
              items from trusted sellers across India.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {PROOFS.map((proof) => (
                <li
                  key={proof}
                  className="flex items-center gap-1.5 text-xs font-medium text-ink-2 sm:text-sm"
                >
                  <CheckCircleIcon
                    size={17}
                    weight="fill"
                    className="text-accent"
                    aria-hidden="true"
                  />
                  {proof}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[170px] md:min-h-full">
            <Image
              src={photo.src}
              alt="A crate of organically grown apples"
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              priority
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-accent-soft via-accent-soft/30 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
