"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
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
  const [seen, setSeen] = useState<number[]>([0]);
  const slide = slides[active];
  const go = (index: number) => {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    setSeen((current) => (current.includes(next) ? current : [...current, next]));
  };

  return (
    <section
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
            {seen.includes(index) && (
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 96rem) 1344px, (min-width: 64rem) 90vw, 100vw"
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                className="object-cover"
              />
            )}
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
        <div key={active} className="banner-in max-w-[52ch]">
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
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <fieldset className="flex items-center gap-1">
            <legend className="sr-only">Choose a slide</legend>
            <div className="slide-dots flex items-center">
              {slides.map((item, index) => (
                <div key={item.title} className="flex">
                  <input
                    type="radio"
                    name="highlight-slide"
                    id={`highlight-slide-${index}`}
                    value={index}
                    checked={index === active}
                    onChange={() => go(index)}
                  />
                  <label htmlFor={`highlight-slide-${index}`}>
                    <span aria-hidden="true" />
                    <span className="sr-only">
                      Show slide {index + 1}: {item.title}
                    </span>
                  </label>
                </div>
              ))}
            </div>
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
                <ArrowLeftIcon aria-hidden="true" size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next highlight"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-paper transition hover:bg-paper/20 motion-reduce:transition-none"
              >
                <ArrowRightIcon aria-hidden="true" size={20} />
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
