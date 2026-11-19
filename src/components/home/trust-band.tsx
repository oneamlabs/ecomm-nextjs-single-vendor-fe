import {
  PackageIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";

const SIGNALS = [
  {
    Icon: StorefrontIcon,
    title: "Multiple Trusted Sellers",
    hint: "Curated organic brands & local producers",
  },
  {
    Icon: PackageIcon,
    title: "Farm to Package",
    hint: "Minimal processing, maximum goodness",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Safe & Authentic",
    hint: "No harmful chemicals or additives",
  },
  {
    Icon: TruckIcon,
    title: "Fast & Reliable Delivery",
    hint: "Across India",
  },
];

export function TrustBand() {
  return (
    <section aria-label="Why shop with Kraya" className="bg-accent-soft">
      <div className="container">
        <ul className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {SIGNALS.map(({ Icon, title, hint }, index) => (
            <li
              key={title}
              className={`flex items-center gap-3 py-4 lg:px-6 ${
                index === 0 ? "lg:pl-0" : ""
              } ${index === SIGNALS.length - 1 ? "lg:pr-0" : ""}`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-accent shadow-card">
                <Icon size={22} weight="duotone" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="mt-0.5 block text-xs text-ink-2">{hint}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
