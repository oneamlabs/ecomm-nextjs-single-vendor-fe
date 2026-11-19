"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface CarouselProps {
  label: string;
  children: ReactNode;
  controlsClassName?: string;
}

/**
 * A scroll-snap rail with two text controls. It scrolls horizontally by touch,
 * trackpad or keyboard, and the buttons move it one page at a time. The
 * controls disable at each end so the rail never pretends there is more.
 */
export function Carousel({
  label,
  children,
  controlsClassName = "",
}: CarouselProps) {
  const rail = useRef<HTMLElement>(null);
  const [bounds, setBounds] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    setBounds({
      start: element.scrollLeft <= 1,
      end: element.scrollLeft >= max - 1,
    });
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;

    measure();
    element.addEventListener("scroll", measure, { passive: true });

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

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
          disabled={bounds.start}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn min-h-11 px-5 text-sm"
          onClick={() => step(1)}
          aria-label="Next items"
          disabled={bounds.end}
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
