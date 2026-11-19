import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const readJson = async (path) =>
  JSON.parse(await readFile(new URL(`../src/data/${path}`, import.meta.url), "utf8"));

const { categories } = await readJson("categories.json");
const { products } = await readJson("products.json");
const { photos } = await readJson("photos.json");

const problems = [];
const categoryIds = new Set(categories.map((category) => category.id));
const productIds = new Set();

for (const product of products) {
  const where = `product "${product.id}"`;

  if (productIds.has(product.id)) problems.push(`${where}: duplicate id`);
  productIds.add(product.id);

  if (!categoryIds.has(product.categoryId)) {
    problems.push(`${where}: unknown categoryId "${product.categoryId}"`);
  }

  const photo = photos[product.photo];
  if (!photo) problems.push(`${where}: unknown photo "${product.photo}"`);
  else if (!existsSync(new URL(`../public${photo.src}`, import.meta.url))) {
    problems.push(`${where}: photo file missing at public${photo.src}`);
  }

  if (typeof product.organic !== "boolean") {
    problems.push(`${where}: organic must be a boolean`);
  }

  if (product.variants.length === 0) problems.push(`${where}: no variants`);

  const variantIds = new Set();
  for (const variant of product.variants) {
    const at = `${where}, variant "${variant.id}"`;
    if (variantIds.has(variant.id)) problems.push(`${at}: duplicate variant id`);
    variantIds.add(variant.id);

    if (!Number.isInteger(variant.priceCents) || variant.priceCents <= 0) {
      problems.push(`${at}: priceCents must be a positive integer`);
    }
    if (!Number.isInteger(variant.netAmount) || variant.netAmount <= 0) {
      problems.push(`${at}: netAmount must be a positive integer`);
    }
    if (!["g", "ml"].includes(variant.netUnit)) {
      problems.push(`${at}: netUnit must be "g" or "ml"`);
    }
    if (typeof variant.inStock !== "boolean") {
      problems.push(`${at}: inStock must be a boolean`);
    }
  }

  if (!product.variants.some((variant) => variant.inStock)) {
    problems.push(`${where}: every variant is out of stock`);
  }
}

if (problems.length > 0) {
  console.error(`Data check failed (${problems.length}):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `Data check passed: ${products.length} products, ${categories.length} categories, ` +
    `${Object.keys(photos).length} photos.`,
);
