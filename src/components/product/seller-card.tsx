import Image from "next/image";
import Link from "next/link";
import {
  ArrowCounterClockwiseIcon,
  CalendarBlankIcon,
  CaretRightIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Rating } from "@/components/product/rating";
import { getPhoto } from "@/lib/photos";
import { formatPrice } from "@/lib/money";
import { DELIVERY } from "@/lib/order";
import type { Vendor } from "@/lib/types";

export function SellerCard({ vendor }: { vendor: Vendor }) {
  const logo = getPhoto(vendor.logoPhoto);

  return (
    <div className="rounded-[var(--radius-md)] border border-rule bg-paper p-4">
      <p className="text-xs text-muted">Sold by</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="size-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-rule bg-paper-2">
          <Image
            src={logo.src}
            alt=""
            width={logo.width}
            height={logo.height}
            sizes="48px"
            className="size-full object-cover"
          />
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/shop?vendor=${vendor.id}`}
            className="block truncate font-body text-base font-bold text-ink transition hover:text-accent"
          >
            {vendor.name}
          </Link>
          <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} />
        </div>
        <Link
          href={`/shop?vendor=${vendor.id}`}
          aria-label={`View ${vendor.name}`}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-rule text-ink-2 transition hover:border-accent hover:text-accent"
        >
          <CaretRightIcon size={15} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

const SAMPLE_DELIVERY_WINDOW = "Tue, 24 Nov – Thu, 26 Nov";

export function SellerBenefits() {
  const delivery = SAMPLE_DELIVERY_WINDOW;

  const benefits = [
    {
      Icon: TruckIcon,
      title: "Free Delivery",
      line: `On orders above ${formatPrice(DELIVERY.freeThresholdCents)}`,
    },
    {
      Icon: CalendarBlankIcon,
      title: "Estimated Delivery",
      line: delivery,
    },
    {
      Icon: ArrowCounterClockwiseIcon,
      title: "Easy Returns",
      line: "7-day return & refund policy",
    },
    {
      Icon: ShieldCheckIcon,
      title: "Secure Payment",
      line: "UPI, Cards, Net Banking & more",
    },
  ];

  return (
    <ul className="grid gap-3 rounded-[var(--radius-md)] border border-rule bg-paper p-4">
      {benefits.map(({ Icon, title, line }) => (
        <li key={title} className="flex items-start gap-2.5">
          <Icon
            size={19}
            className="mt-0.5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <span>
            <span className="block text-xs font-semibold text-ink">{title}</span>
            <span className="mt-0.5 block text-xs leading-snug text-muted">{line}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

