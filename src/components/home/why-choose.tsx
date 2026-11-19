import {
  LeafIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";

const REASONS = [
  {
    Icon: LeafIcon,
    title: "100% Organic",
    line: "Chemical-free & naturally grown",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Verified Vendors",
    line: "Only trusted and quality-checked sellers",
  },
  {
    Icon: PackageIcon,
    title: "Safe Packaging",
    line: "Eco-friendly & food-grade packs",
  },
  {
    Icon: TruckIcon,
    title: "Pan-India Delivery",
    line: "Fresh & safe delivery across India",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why-kraya"
      aria-labelledby="why-kraya-title"
      className="relative overflow-hidden bg-paper-2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-soft/70 to-transparent"
      />
      <div className="container relative py-10 md:py-14">
        <h2
          id="why-kraya-title"
          className="text-center text-[length:var(--text-section)]"
        >
          Why Choose Kraya?
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {REASONS.map(({ Icon, title, line }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <span className="grid size-16 place-items-center rounded-full border-2 border-accent/30 text-accent">
                <Icon size={30} weight="duotone" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-ink sm:text-base">{title}</h3>
              <p className="mt-1 max-w-[22ch] text-xs leading-relaxed text-muted sm:text-sm">
                {line}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
