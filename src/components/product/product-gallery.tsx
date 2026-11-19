"use client";

import Link from "next/link";
import {
  CaretLeftIcon,
  CaretRightIcon,
  PlayIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { announce } from "@/lib/announce";
import { getPhoto } from "@/lib/photos";
import { ProductPhoto } from "./product-photo";

export interface GalleryImage {
  key: string;
  alt: string;
  label: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [videoNote, setVideoNote] = useState("");
  const current = images[active];
  const credit = getPhoto(current.key);

  function go(delta: number) {
    setActive((index) => (index + delta + images.length) % images.length);
  }

  function playVideo() {
    const message = "Product video is not part of this demo.";
    setVideoNote(message);
    announce(message);
  }

  return (
    <div>
      <div className="flex gap-3">
        <div className="hidden w-16 shrink-0 flex-col gap-2 sm:flex">
          {images.map((image, index) => (
            <button
              key={image.key}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              aria-label={`View ${image.label}`}
              className={`overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors ${
                index === active
                  ? "border-accent"
                  : "border-transparent hover:border-rule"
              }`}
            >
              <ProductPhoto
                photoKey={image.key}
                alt=""
                sizes="64px"
                className="aspect-square w-16 rounded-none shadow-none"
              />
            </button>
          ))}

          <button
            type="button"
            onClick={playVideo}
            aria-label="Play product video"
            className="grid size-16 place-items-center rounded-[var(--radius-md)] border border-rule bg-paper-2 text-accent transition hover:border-accent-line"
          >
            <PlayIcon size={20} weight="fill" aria-hidden="true" />
          </button>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-paper-2">
            <ProductPhoto
              photoKey={current.key}
              alt={current.alt}
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 52vw, 92vw"
              priority
              className="aspect-[4/5] w-full rounded-[var(--radius-lg)] shadow-none"
            />

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-rule bg-paper/95 text-ink shadow-card transition hover:bg-paper"
            >
              <CaretLeftIcon size={18} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-rule bg-paper/95 text-ink shadow-card transition hover:bg-paper"
            >
              <CaretRightIcon size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={image.key}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show ${image.label}`}
                aria-pressed={index === active}
                className={`size-2 rounded-full transition ${
                  index === active ? "bg-accent" : "bg-rule-strong hover:bg-ink-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-2 sm:hidden">
        {images.map((image, index) => (
          <button
            key={image.key}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            aria-label={`View ${image.label}`}
            className={`overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors ${
              index === active
                ? "border-accent"
                : "border-transparent hover:border-rule"
            }`}
          >
            <ProductPhoto
              photoKey={image.key}
              alt=""
              sizes="56px"
              className="aspect-square w-14 rounded-none shadow-none"
            />
          </button>
        ))}
        <button
          type="button"
          onClick={playVideo}
          aria-label="Play product video"
          className="grid size-14 place-items-center rounded-[var(--radius-md)] border border-rule bg-paper-2 text-accent"
        >
          <PlayIcon size={18} weight="fill" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Photograph by {credit.author} ({credit.license}).{" "}
        <Link href="/credits" className="link-quiet">
          Credits
        </Link>
      </p>
      {videoNote && <p className="mt-1 text-xs text-muted">{videoNote}</p>}
    </div>
  );
}
