import Link from "next/link";
import {
  BarbellIcon,
  GaugeIcon,
  HeartbeatIcon,
  LeafIcon,
  PlantIcon,
  ShieldCheckIcon,
  SmileyIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeader } from "@/components/layout/section";
import { DIETS } from "@/lib/diets";

const ICONS = {
  "gluten-free": LeafIcon,
  "high-protein": BarbellIcon,
  "low-gi": GaugeIcon,
  vegan: PlantIcon,
  "diabetic-friendly": ShieldCheckIcon,
  "immunity-boosting": HeartbeatIcon,
  "kids-friendly": SmileyIcon,
} as const;

export function DietGrid() {
  return (
    <div>
      <SectionHeader
        title="Shop by Diet & Lifestyle"
        lede="Find organic food that fits your lifestyle"
      />

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {DIETS.map((diet) => {
          const Icon = ICONS[diet.id];

          return (
            <li key={diet.id}>
              <Link
                href={`/shop?diet=${diet.id}`}
                className="group flex h-full flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-rule bg-accent-soft/70 px-3 py-5 text-center transition hover:border-accent-line hover:bg-accent-soft"
              >
                <Icon
                  size={26}
                  weight="duotone"
                  className="text-accent transition group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-ink sm:text-sm">
                  {diet.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
