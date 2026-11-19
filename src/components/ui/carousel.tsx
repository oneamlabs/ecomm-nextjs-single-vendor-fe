"use client";

import { useRef, type ReactNode } from "react";

interface CarouselProps {
  label: string;
  children: ReactNode;
  controlsClassName?: string;
}

/**
 * A scroll-snap rail with two text controls. It scrolls horizontally by touch,
 * trackpad or keyboard, and the buttons move it one page at a time.
 */
export function Carousel({
  label,
  children,
  controlsClassName = "",
}: CarouselProps) {
  const rail = useRef<HTMLElement>(null);

  function step(direction: -1 | 1) {
    const element = rail.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({
      left: direction * Math.max(300, element.clientWidth * 0.8),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div className="overflow-x-clip">
      <div className={`mb-4 flex justify-end gap-2 pr-1 ${controlsClassName}`}>
        <button
          type="button"
          className="btn min-h-11 px-5 text-sm"
          onClick={() => step(-1)}
          aria-label="Previous items"
        >
          Previous
        </button>
        <button
          type="button"
          className="btn min-h-11 px-5 text-sm"
          onClick={() => step(1)}
          aria-label="Next items"
        >
          Next
        </button>
      </div>

      <section
        ref={rail}
        aria-roledescription="carousel"
        aria-label={label}
        className="rail"
      >
        {children}
      </section>
    </div>
  );
}
