import {
  BarbellIcon,
  FlaskIcon,
  GrainsSlashIcon,
  LeafIcon,
  PlantIcon,
} from "@phosphor-icons/react/dist/ssr";

const ICONS = [LeafIcon, GrainsSlashIcon, BarbellIcon, FlaskIcon, PlantIcon];

export function ProductHighlights({ highlights }: { highlights: string[] }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-rule bg-paper px-4 py-3">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-rule">
        {highlights.slice(0, 5).map((label, index) => {
          const Icon = ICONS[index] ?? LeafIcon;

          return (
            <li
              key={label}
              className="flex items-center justify-center gap-2 lg:px-3"
            >
              <Icon size={22} weight="duotone" className="shrink-0 text-accent" aria-hidden="true" />
              <span className="text-xs font-semibold leading-tight text-ink sm:text-sm">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
