import detailsJson from "@/data/product-details.json";
import type { Product, Vendor } from "./types";

export interface ProductFeature {
  title: string;
  line: string;
}

export interface NutritionRow {
  label: string;
  value: string;
}

export interface ProductDetail {
  soldCount?: number;
  stockLeft?: number;
  longDescription: string;
  highlights: string[];
  features: ProductFeature[];
  nutrition: NutritionRow[];
  ingredients: string;
  howToUse: string[];
}

const stored = detailsJson.details as Record<string, Partial<ProductDetail>>;

export function getProductDetail(product: Product, vendor?: Vendor): ProductDetail {
  const detail = stored[product.id];

  return {
    soldCount: detail?.soldCount,
    stockLeft: detail?.stockLeft,
    longDescription: detail?.longDescription ?? defaultDescription(product, vendor),
    highlights: detail?.highlights ?? defaultHighlights(product),
    features: detail?.features ?? defaultFeatures(product, vendor),
    nutrition: detail?.nutrition ?? defaultNutrition(product),
    ingredients: detail?.ingredients ?? `100% organic ${product.name.toLowerCase()}.`,
    howToUse: detail?.howToUse ?? defaultHowToUse(product),
  };
}

function defaultDescription(product: Product, vendor?: Vendor) {
  const seller = vendor ? ` by ${vendor.name}, ${vendor.location}` : "";
  return `${product.summary} Sourced from ${product.origin} and packed${seller}.`;
}

function defaultHighlights(product: Product) {
  const highlights = ["100% Organic"];

  highlights.push(product.tags.includes("gluten-free") ? "Gluten Free" : "Whole Food");
  highlights.push(product.diets?.includes("high-protein") ? "High Protein" : "Plant Based");
  highlights.push("No Additives");
  highlights.push(product.diets?.includes("vegan") ? "Vegan Friendly" : "Quality Assured");

  return highlights;
}

function defaultFeatures(product: Product, vendor?: Vendor): ProductFeature[] {
  return [
    {
      title: "Thoughtfully sourced",
      line: `Grown or made in ${product.origin}.`,
    },
    {
      title: "Packed for freshness",
      line: "Sealed in a food-grade pack.",
    },
    {
      title: "Everyday essential",
      line: "A simple addition to the pantry.",
    },
    {
      title: "From a verified seller",
      line: vendor ? `${vendor.name}, ${vendor.location}.` : "A quality-checked producer.",
    },
  ];
}

function defaultNutrition(product: Product): NutritionRow[] {
  if (product.categoryId === "oils") {
    return [
      { label: "Energy", value: "900 kcal" },
      { label: "Total Fat", value: "100 g" },
      { label: "Saturated Fat", value: "20 g" },
      { label: "Protein", value: "0 g" },
      { label: "Carbohydrates", value: "0 g" },
      { label: "Sodium", value: "0 mg" },
    ];
  }

  if (product.categoryId === "beverages") {
    return [
      { label: "Energy", value: "240 kcal" },
      { label: "Protein", value: "6 g" },
      { label: "Carbohydrates", value: "52 g" },
      { label: "Total Fat", value: "4 g" },
      { label: "Dietary Fibre", value: "5 g" },
      { label: "Sodium", value: "12 mg" },
    ];
  }

  return [
    { label: "Energy", value: "360 kcal" },
    { label: "Protein", value: "11 g" },
    { label: "Carbohydrates", value: "62 g" },
    { label: "Total Fat", value: "6 g" },
    { label: "Dietary Fibre", value: "8 g" },
    { label: "Sugars", value: "4 g" },
    { label: "Sodium", value: "18 mg" },
  ];
}

function defaultHowToUse(product: Product): string[] {
  if (product.categoryId === "oils") {
    return [
      "Use for cooking, dressing or finishing a dish.",
      "Store away from direct sunlight.",
      "Close the cap tightly after use.",
    ];
  }

  return [
    "Use as part of a normal balanced diet.",
    "Store in a cool, dry place.",
    "Reseal the pack after opening.",
  ];
}
