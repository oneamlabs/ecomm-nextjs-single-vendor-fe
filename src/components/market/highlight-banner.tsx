"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface HighlightSlide {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}

interface HighlightBannerProps {
  slides: HighlightSlide[];
}

export function HighlightBanner({ slides }: HighlightBannerProps) {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const go = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Kraya highlights"
      className="relative overflow-hidden rounded-[var(--radius-lg)] bg-ink"
    >
      <div className="absolute inset-0">
        {slides.map((item, index) => (
          <div
            key={item.image}
            aria-hidden={index !== active}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 80rem) 1344px, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-ink/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"
      />

      <div className="relative z-10 flex min-h-[480px] flex-col justify-end p-6 sm:p-8 md:min-h-[420px] md:p-12">
        <section
          key={active}
          aria-roledescription="slide"
          aria-label={`${active + 1} of ${slides.length}`}
          className="banner-in max-w-[52ch]"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-paper/80">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {slide.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[0.98] tracking-[-0.03em] text-paper md:text-6xl">
            {slide.title}
          </h2>
          <p className="mt-4 max-w-[42ch] text-md leading-relaxed text-paper/85 md:text-lg">
            {slide.body}
          </p>
          <Link
            href={slide.href}
            className="btn btn--primary mt-6 focus-visible:outline-paper"
          >
            {slide.cta}
          </Link>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <fieldset className="flex items-center gap-1">
            <legend className="sr-only">Choose a slide</legend>
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => go(index)}
                aria-label={`Show slide ${index + 1}: ${item.title}`}
                aria-pressed={index === active}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    index === active
                      ? "w-8 bg-paper"
                      : "w-2.5 bg-paper/60 hover:bg-paper/80"
                  }`}
                />
              </button>
            ))}
          </fieldset>

          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="num text-sm text-paper/80">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous highlight"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-paper transition hover:bg-paper/20 motion-reduce:transition-none"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next highlight"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-paper transition hover:bg-paper/20 motion-reduce:transition-none"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          Slide {active + 1} of {slides.length}: {slide.title}
        </p>
      </div>
    </section>
  );
}
