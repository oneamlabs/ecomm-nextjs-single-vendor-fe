import { launch } from "puppeteer-core";
import { AxePuppeteer } from "@axe-core/puppeteer";

const CHROME =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.INSPECT_URL ?? "http://localhost:3000";

/**
 * Every public route, including the ones the other scripts skip: the saved list,
 * the 404 and the account placeholder all ship real UI.
 */
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/shop", name: "shop" },
  { path: "/shop/organic-red-quinoa", name: "product" },
  { path: "/vendors", name: "vendors" },
  { path: "/basket", name: "basket" },
  { path: "/checkout", name: "checkout" },
  { path: "/wishlist", name: "wishlist" },
  { path: "/policies", name: "policies" },
  { path: "/account", name: "account" },
  { path: "/account/orders", name: "account-orders" },
  { path: "/account/addresses", name: "account-addresses" },
  { path: "/account/profile", name: "account-profile" },
  { path: "/account/sign-in", name: "sign-in" },
  { path: "/account/sign-up", name: "sign-up" },
  { path: "/shop/does-not-exist", name: "not-found" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

/** WCAG 2.1 A and AA, which is what DESIGN.md claims. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const browser = await launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const all = [];

for (const viewport of VIEWPORTS) {
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
  });

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "load", timeout: 45_000 });
    await page.waitForSelector("h1", { timeout: 30_000 });
    // Let CSS-driven entrance animations settle so nothing is mid-fade.
    await new Promise((resolve) => setTimeout(resolve, 400));

    const results = await new AxePuppeteer(page)
      .withTags(TAGS)
      .analyze();

    const serious = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );

    console.log(
      `${route.name}/${viewport.name}`.padEnd(26),
      `violations=${String(results.violations.length).padEnd(3)}`,
      serious.length ? `SERIOUS=${serious.length}` : "serious=0",
      `incomplete=${results.incomplete.length}`,
    );

    for (const violation of results.violations) {
      const targets = violation.nodes
        .slice(0, 3)
        .map((node) => node.target.join(" "))
        .join(" | ");
      all.push({
        route: route.name,
        viewport: viewport.name,
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
        help: violation.help,
        targets,
      });
    }
  }
}

await browser.close();

if (all.length > 0) {
  console.log("\nAll violations:");
  for (const row of all) {
    console.log(
      [
        row.route.padEnd(12),
        row.viewport.padEnd(8),
        String(row.impact).padEnd(10),
        row.id.padEnd(26),
        `nodes=${row.nodes}`,
        row.help,
      ].join(" "),
    );
    console.log(`  targets: ${row.targets}`);
  }
} else {
  console.log("\nNo WCAG 2.1 A/AA violations found.");
}

const serious = all.filter((row) => row.impact === "critical" || row.impact === "serious");
process.exit(serious.length > 0 ? 1 : 0);
