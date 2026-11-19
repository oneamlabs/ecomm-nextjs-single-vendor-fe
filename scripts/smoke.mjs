const BASE = process.env.SMOKE_URL ?? "http://localhost:3100";

const ROUTES = [
  "/",
  "/shop",
  "/shop?category=drinks",
  "/shop?tag=vegan&sort=price",
  "/shop/olive-oil",
  "/shop/beaufort-cheese",
  "/basket",
  "/checkout",
  "/shop/does-not-exist",
];

function tidy(html) {
  return (html ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 50);
}

const results = await Promise.all(
  ROUTES.map(async (route) => {
    const started = Date.now();
    try {
      const response = await fetch(`${BASE}${route}`, {
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
      });
      const html = await response.text();
      return {
        route,
        status: response.status,
        ms: Date.now() - started,
        h1: tidy(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]),
      };
    } catch (error) {
      return { route, status: 0, ms: Date.now() - started, h1: error.message };
    }
  }),
);

for (const result of results) {
  console.log(
    String(result.status).padEnd(4),
    result.route.padEnd(30),
    `${result.ms}ms`.padEnd(7),
    result.h1,
  );
}

const failures = results.filter((result) => result.status >= 500 || result.status === 0);
console.log(failures.length === 0 ? "\nAll routes OK" : `\n${failures.length} failures`);
process.exit(failures.length === 0 ? 0 : 1);
