"use client";

import Link from "next/link";
import { useState } from "react";
import { getPhoto } from "@/lib/photos";
import { ProductPhoto } from "./product-photo";

interface GalleryImage {
  key: string;
  alt: string;
  label: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active];
  const credit = getPhoto(current.key);

  return (
    <div>
      <div className="flex gap-3">
        <div className="hidden shrink-0 flex-col gap-2 sm:flex">
          {images.map((image, index) => (
            <button
              key={`${image.key}-thumb-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              aria-label={`View ${image.label}`}
              className={`overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors ${
                index === active
                  ? "border-ink"
                  : "border-transparent hover:border-rule"
              }`}
            >
              <ProductPhoto
                photoKey={image.key}
                alt=""
                sizes="64px"
                className="aspect-square w-16 rounded-none"
              />
            </button>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden rounded-[var(--radius-lg)] bg-paper-2 p-2.5">
          <ProductPhoto
            photoKey={current.key}
            alt={current.alt}
            sizes="(min-width: 64rem) 40vw, 92vw"
            priority
            className="aspect-[4/5] rounded-[var(--radius-md)]"
          />
          <span className="num absolute bottom-4 right-4 rounded-full bg-paper/90 px-2.5 py-1 text-sm text-ink-2">
            {active + 1} / {images.length}
          </span>
        </div>
      </div>

      <div className="mt-2 flex gap-2 sm:hidden">
        {images.map((image, index) => (
          <button
            key={`${image.key}-mobile-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            aria-label={`View ${image.label}`}
            className={`overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors ${
              index === active
                ? "border-ink"
                : "border-transparent hover:border-rule"
            }`}
          >
            <ProductPhoto
              photoKey={image.key}
              alt=""
              sizes="64px"
              className="aspect-square w-16 rounded-none"
            />
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted">
        Photograph by {credit.author} ({credit.license}).{" "}
        <Link href="/credits" className="link-quiet">
          Credits
        </Link>
      </p>
    </div>
  );
}
