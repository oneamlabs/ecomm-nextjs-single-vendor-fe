export type NetUnit = "g" | "ml";

export interface Variant {
  id: string;
  label: string;
  priceCents: number;
  netAmount: number;
  netUnit: NetUnit;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  origin: string;
  summary: string;
  photo: string;
  photoAlt: string;
  tags: string[];
  organic: boolean;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  summary: string;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  source: string;
}
