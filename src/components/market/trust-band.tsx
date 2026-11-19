import {
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * The service facts that actually decide an order here. They mirror the shop
 * facts section: no invented certifications, no payment claims the demo cannot
 * honour, and no delivery-speed promise beyond the stated cut-off.
 */
const SIGNALS = [
  {
    Icon: PackageIcon,
    label: "Weighed and packed here",
    hint: "Every pack labelled on Row Street",
  },
  {
    Icon: TruckIcon,
    label: "Free delivery over £40",
    hint: "£3.50 under that",
  },
  {
    Icon: MapPinIcon,
    label: "Bristol, eight miles",
    hint: "Same day before 11:00",
  },
  {
    Icon: ShieldCheckIcon,
    label: "Replaced if wrong",
    hint: "No return postage to arrange",
  },
];

export function TrustBand() {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
      {SIGNALS.map(({ Icon, label, hint }) => (
        <li key={label} className="flex items-start gap-3">
          <Icon size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-ink">{label}</p>
            <p className="mt-0.5 text-sm text-ink-2">{hint}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
