import type { Metadata } from "next";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import photosJson from "@/data/photos.json";
import type { Photo } from "@/lib/types";

const photos = Object.values(photosJson.photos as Record<string, Photo>);

export const metadata: Metadata = {
  title: "Photographs - Kraya",
  description:
    "The library photographs used on this demo, with their authors and licences.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Photographs"
        lede="The library photographs used on this demo, with their authors and licences."
      />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {photos.map((photo) => (
          <li
            key={photo.src}
            className="rounded-[var(--radius-md)] bg-paper-2 p-4 text-sm"
          >
            <a
              href={photo.source}
              className="link-quiet font-semibold"
              rel="noreferrer"
              target="_blank"
            >
              {photo.author}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-1 text-muted">{photo.license}</p>
            <p className="mt-2 break-all text-xs text-muted">{photo.src}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
