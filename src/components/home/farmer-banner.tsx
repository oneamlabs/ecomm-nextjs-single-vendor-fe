import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CoinsIcon,
  PlantIcon,
  RecycleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getPhoto } from "@/lib/photos";

const BENEFITS = [
  {
    Icon: CoinsIcon,
    title: "Fair Prices",
    line: "Better earnings for farmers",
  },
  {
    Icon: PlantIcon,
    title: "Direct Sourcing",
    line: "From farms to your doorstep",
  },
  {
    Icon: RecycleIcon,
    title: "Sustainable & Ethical",
    line: "Good for you, good for the planet",
  },
];

export function FarmerBanner() {
  const photo = getPhoto("market-stall");

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule">
      <div className="grid lg:grid-cols-12">
        <div className="bg-forest p-7 text-paper sm:p-9 lg:col-span-5 lg:p-10">
          <h2 className="max-w-[16ch] text-[length:var(--text-section)] text-paper">
            Support Local Organic Farmers
          </h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-paper/80">
            Buy directly from verified producers and help build a healthier,
            sustainable India.
          </p>
          <Link
            href="/vendors"
            className="btn mt-6 bg-paper text-forest hover:bg-accent-soft hover:text-forest"
          >
            Meet Our Farmers
            <ArrowRightIcon size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative min-h-[220px] lg:col-span-4 lg:min-h-full">
          <Image
            src={photo.src}
            alt="A farmer holding a basket of freshly picked vegetables"
            fill
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover"
          />
        </div>

        <ul className="grid content-center gap-4 bg-accent-soft p-6 sm:p-8 lg:col-span-3">
          {BENEFITS.map(({ Icon, title, line }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-accent">
                <Icon size={19} weight="duotone" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="mt-0.5 block text-xs text-ink-2">{line}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
