export type NetUnit = "g" | "ml" | "item";

export interface Variant {
  id: string;
  label: string;
  priceCents: number;
  mrpCents?: number;
  netAmount: number;
  netUnit: NetUnit;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  vendorId?: string;
  origin: string;
  summary: string;
  photo: string;
  photoAlt: string;
  tags: string[];
  diets?: string[];
  organic: boolean;
  rating?: number;
  reviewCount?: number;
  mrpCents?: number;
  badge?: string;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  summary: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  summary: string;
  bannerPhoto: string;
  logoPhoto: string;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  source: string;
}

export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

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
