import {
  LeafIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";

const SIGNALS = [
  {
    Icon: LeafIcon,
    title: "100% Organic",
    hint: "Chemical-free & naturally grown",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Quality Assured",
    hint: "Lab-tested, safe & pure",
  },
  {
    Icon: PackageIcon,
    title: "Secure Packaging",
    hint: "Eco-friendly & food-grade",
  },
  {
    Icon: TruckIcon,
    title: "Pan-India Delivery",
    hint: "Fresh & reliable delivery",
  },
];

export function CartAssurance() {
  return (
    <section
      aria-label="Shopping assurances"
      className="mt-10 rounded-[var(--radius-md)] bg-accent-soft"
    >
      <ul className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {SIGNALS.map(({ Icon, title, hint }, index) => (
          <li
            key={title}
            className={`flex items-center gap-3 px-4 py-4 lg:px-6 ${
              index === 0 ? "lg:pl-6" : ""
            }`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-accent shadow-card">
              <Icon size={22} weight="duotone" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">
                {title}
              </span>
              <span className="mt-0.5 block text-xs text-ink-2">{hint}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
