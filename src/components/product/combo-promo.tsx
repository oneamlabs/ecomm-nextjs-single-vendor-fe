import Link from "next/link";
import { ArrowRightIcon, GiftIcon } from "@phosphor-icons/react/dist/ssr";
import { getPhoto } from "@/lib/photos";
import Image from "next/image";

export function ComboPromo() {
  const photo = getPhoto("market-stall");

  return (
    <div className="rounded-[var(--radius-md)] bg-accent-soft p-4">
      <div className="flex items-start gap-2.5">
        <GiftIcon size={22} weight="duotone" className="shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="font-body text-sm font-bold text-ink">
            Save More with Combo Deals
          </p>
          <p className="mt-0.5 text-xs leading-snug text-ink-2">
            Get up to 15% off on organic essentials
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="relative h-20 w-28 overflow-hidden rounded-[var(--radius-sm)] bg-paper">
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <Link
          href="/shop?category=combos"
          aria-label="Shop combo deals"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition hover:bg-accent-hover"
        >
          <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
