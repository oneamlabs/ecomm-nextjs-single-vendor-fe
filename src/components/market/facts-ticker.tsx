"use client";

import { useState } from "react";

export function FactsTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="marquee relative bg-ink py-4 text-paper" aria-label="Kraya">
      <div className="marquee-track" data-paused={paused ? "true" : undefined}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-12 pr-12 font-display text-[length:var(--text-title)] font-semibold tracking-[-0.02em]"
          >
            <span>Weighed here</span>
            <span>Packed here</span>
            <span>Twelve provisions</span>
            <span>Bristol</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Play the facts ticker" : "Pause the facts ticker"}
        className="btn absolute right-4 top-1/2 z-10 min-h-11 -translate-y-1/2 px-3 text-sm md:right-6 md:min-h-9"
      >
        {paused ? "Play" : "Pause"}
      </button>
    </section>
  );
}
