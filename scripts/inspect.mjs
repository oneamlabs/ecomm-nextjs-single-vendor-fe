import { launch } from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.INSPECT_URL ?? "http://localhost:3000";
const OUT = "screenshots";

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/shop", name: "shop" },
  { path: "/shop/organic-red-quinoa", name: "product" },
  { path: "/vendors", name: "vendors" },
  { path: "/basket", name: "basket" },
  { path: "/checkout", name: "checkout" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

function readFacts() {
  const doc = document;
  const box = (selector) => doc.querySelector(selector)?.getBoundingClientRect();
  const heading = box("h1");
  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    h1Bottom: heading ? Math.round(heading.bottom) : null,
    h1Size: document.querySelector("h1")
      ? Math.round(parseFloat(getComputedStyle(document.querySelector("h1")).fontSize))
      : null,
    brokenImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0)
      .length,
    pageHeight: document.documentElement.scrollHeight,
  };
}

await mkdir(OUT, { recursive: true });

const browser = await launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const problems = [];

page.on("console", (message) => {
  if (message.type() === "error") problems.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
page.on("requestfailed", (request) => {
  if (!request.url().includes("favicon") && request.failure()?.errorText !== "net::ERR_ABORTED") {
    problems.push(`request failed: ${request.url()} ${request.failure()?.errorText}`);
  }
});

for (const viewport of VIEWPORTS) {
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });

  for (const route of ROUTES) {
    const before = problems.length;
    let facts;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await page.goto(`${BASE}${route.path}`, {
          waitUntil: "load",
          timeout: 45_000,
        });
        await page.waitForSelector("h1", { timeout: 30_000 });
        await new Promise((resolve) => setTimeout(resolve, 300));
        facts = await page.evaluate(readFacts);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!facts) continue;
    await page.screenshot({ path: `${OUT}/${route.name}-${viewport.name}.png` });
    const overflow =
      facts.scrollWidth > facts.clientWidth + 1
        ? ` OVERFLOW ${facts.scrollWidth}>${facts.clientWidth}`
        : "";
    const broken = facts.brokenImages > 0 ? ` BROKEN_IMAGES ${facts.brokenImages}` : "";
    const errors = problems.length - before;

    console.log(
      `${route.name}/${viewport.name}`.padEnd(20),
      `h=${facts.pageHeight}`.padEnd(8),
      `h1=${facts.h1Size}px@${facts.h1Bottom}`.padEnd(14),
      `${errors ? errors + " ERR" : "clean"}${overflow}${broken}`,
    );
  }
}

if (problems.length > 0) {
  console.log("\nIssues:");
  for (const problem of new Set(problems)) console.log("  " + problem);
}

await browser.close();
