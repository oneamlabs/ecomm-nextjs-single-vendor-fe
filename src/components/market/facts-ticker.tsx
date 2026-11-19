"use client";

import { useState } from "react";

const FACTS = ["Weighed here", "Packed here", "Twelve provisions", "Bristol"];

export function FactsTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className="marquee flex items-center gap-3 bg-ink py-4 pl-0 pr-4 text-paper md:pr-6"
      aria-label="Shop facts"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="marquee-track" data-paused={paused ? "true" : undefined}>
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-12 pr-12 font-display text-[length:var(--text-title)] font-semibold tracking-[-0.02em]"
            >
              {FACTS.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Play the facts ticker" : "Pause the facts ticker"}
        className="marquee-control btn min-h-11 shrink-0 px-3 text-sm"
      >
        {paused ? "Play" : "Pause"}
      </button>
    </section>
  );
}
