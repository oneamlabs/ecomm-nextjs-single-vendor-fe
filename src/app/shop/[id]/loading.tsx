const PACKS = ["a", "b", "c"];

export default function ProductLoading() {
  return (
    <div className="container pb-[var(--section-gap)] pt-4" aria-busy="true">
      <output className="sr-only">Loading the product</output>

      <div className="h-3 w-48 animate-pulse rounded bg-rule-2" />

      <div className="mt-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)_minmax(0,0.75fr)]">
        <div className="aspect-[4/5] animate-pulse rounded-[var(--radius-md)] bg-rule-2" />

        <div className="space-y-3">
          <div className="h-6 w-28 animate-pulse rounded bg-rule-2" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-rule-2" />
          <div className="h-4 w-full animate-pulse rounded bg-rule-2" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-rule-2" />
          <div className="mt-6 h-8 w-40 animate-pulse rounded bg-rule-2" />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PACKS.map((pack) => (
              <div
                key={pack}
                className="h-16 animate-pulse rounded-[var(--radius-sm)] bg-rule-2"
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-11 flex-1 animate-pulse rounded bg-rule-2" />
            <div className="h-11 flex-1 animate-pulse rounded bg-rule-2" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-rule-2" />
          <div className="h-32 animate-pulse rounded-[var(--radius-md)] bg-rule-2" />
        </div>
      </div>

      <div className="mt-5 h-16 animate-pulse rounded-[var(--radius-md)] bg-rule-2" />
      <div className="mt-6 h-80 animate-pulse rounded-[var(--radius-md)] bg-rule-2" />
    </div>
  );
}
