const CHIPS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const CARDS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function ShopLoading() {
  return (
    <div className="container pb-[var(--section-gap)] pt-10" aria-busy="true">
      <output className="sr-only">Loading the catalogue</output>

      <div className="h-3 w-40 animate-pulse rounded bg-rule-2" />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-9 w-56 animate-pulse rounded bg-rule-2" />
          <div className="mt-3 h-3 w-72 max-w-full animate-pulse rounded bg-rule-2" />
        </div>
        <div className="h-9 w-40 animate-pulse rounded bg-rule-2" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <div
            key={chip}
            className="h-8 w-24 animate-pulse rounded-[var(--radius-sm)] bg-rule-2"
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="hidden h-[28rem] animate-pulse rounded-[var(--radius-md)] bg-rule-2 lg:block" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {CARDS.map((card) => (
            <div
              key={card}
              className="overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper"
            >
              <div className="aspect-square animate-pulse bg-rule-2" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-4/5 animate-pulse rounded bg-rule-2" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-rule-2" />
                <div className="h-9 animate-pulse rounded bg-rule-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
