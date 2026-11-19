import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { Rating } from "@/components/product/rating";
import { getPhoto } from "@/lib/photos";
import type { Vendor } from "@/lib/types";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const banner = getPhoto(vendor.bannerPhoto);
  const logo = getPhoto(vendor.logoPhoto);

  return (
    <article
      id={vendor.id}
      className="group h-full overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper transition duration-300 hover:border-accent-line hover:shadow-lift"
    >
      <div className="relative">
        <div className="relative h-24 overflow-hidden bg-paper-2">
          <Image
            src={banner.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 48vw, 92vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent"
          />
        </div>
        <div className="absolute -bottom-6 left-4 size-14 overflow-hidden rounded-full border-4 border-paper bg-paper shadow-card">
          <Image
            src={logo.src}
            alt=""
            width={logo.width}
            height={logo.height}
            sizes="56px"
            className="size-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 pb-4 pt-8">
        <h3 className="text-base font-bold text-ink">{vendor.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPinIcon size={12} weight="bold" aria-hidden="true" />
          {vendor.location}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} />
          <Link
            href={`/shop?vendor=${vendor.id}`}
            className="btn btn--outline min-h-8 px-3 text-xs"
          >
            View Store
            <ArrowRightIcon size={12} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
