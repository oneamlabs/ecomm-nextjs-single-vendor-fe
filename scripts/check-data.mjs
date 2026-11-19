import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const readJson = async (path) =>
  JSON.parse(await readFile(new URL(`../src/data/${path}`, import.meta.url), "utf8"));

const { categories } = await readJson("categories.json");
const { products } = await readJson("products.json");
const { vendors } = await readJson("vendors.json");
const { photos } = await readJson("photos.json");

const problems = [];
const categoryIds = new Set(categories.map((category) => category.id));
const vendorIds = new Set(vendors.map((vendor) => vendor.id));
const productIds = new Set();

for (const vendor of vendors) {
  const where = `vendor "${vendor.id}"`;
  if (typeof vendor.rating !== "number" || vendor.rating < 0 || vendor.rating > 5) {
    problems.push(`${where}: rating must be between 0 and 5`);
  }
  if (!Number.isInteger(vendor.reviewCount) || vendor.reviewCount < 0) {
    problems.push(`${where}: reviewCount must be a non-negative integer`);
  }
  for (const key of ["bannerPhoto", "logoPhoto"]) {
    if (!photos[vendor[key]]) problems.push(`${where}: unknown ${key} "${vendor[key]}"`);
  }
}

for (const product of products) {
  const where = `product "${product.id}"`;

  if (productIds.has(product.id)) problems.push(`${where}: duplicate id`);
  productIds.add(product.id);

  if (!categoryIds.has(product.categoryId)) {
    problems.push(`${where}: unknown categoryId "${product.categoryId}"`);
  }

  if (product.vendorId !== undefined && !vendorIds.has(product.vendorId)) {
    problems.push(`${where}: unknown vendorId "${product.vendorId}"`);
  }

  const photo = photos[product.photo];
  if (!photo) problems.push(`${where}: unknown photo "${product.photo}"`);
  else if (!existsSync(new URL(`../public${photo.src}`, import.meta.url))) {
    problems.push(`${where}: photo file missing at public${photo.src}`);
  }

  if (typeof product.organic !== "boolean") {
    problems.push(`${where}: organic must be a boolean`);
  }

  if (!Array.isArray(product.diets)) {
    problems.push(`${where}: diets must be an array`);
  }

  if (
    product.rating !== undefined &&
    (typeof product.rating !== "number" || product.rating < 0 || product.rating > 5)
  ) {
    problems.push(`${where}: rating must be between 0 and 5`);
  }

  if (
    product.reviewCount !== undefined &&
    (!Number.isInteger(product.reviewCount) || product.reviewCount < 0)
  ) {
    problems.push(`${where}: reviewCount must be a non-negative integer`);
  }

  if (
    product.mrpCents !== undefined &&
    (!Number.isInteger(product.mrpCents) || product.mrpCents <= 0)
  ) {
    problems.push(`${where}: mrpCents must be a positive integer`);
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
    if (
      variant.mrpCents !== undefined &&
      (!Number.isInteger(variant.mrpCents) || variant.mrpCents <= variant.priceCents)
    ) {
      problems.push(`${at}: mrpCents must be an integer above priceCents`);
    }
    if (!Number.isInteger(variant.netAmount) || variant.netAmount <= 0) {
      problems.push(`${at}: netAmount must be a positive integer`);
    }
    if (!["g", "ml", "item"].includes(variant.netUnit)) {
      problems.push(`${at}: netUnit must be "g", "ml" or "item"`);
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
    `${vendors.length} vendors, ${Object.keys(photos).length} photos.`,
);
