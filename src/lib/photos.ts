import photosJson from "@/data/photos.json";
import type { Photo } from "./types";

const photos = photosJson.photos as Record<string, Photo>;

export function getPhoto(key: string): Photo {
  const photo = photos[key];
  if (photo) return photo;
  throw new Error(
    `Unknown photo "${key}". Add it to src/data/photos.json or fix the product.`,
  );
}

export function hasPhoto(key: string): boolean {
  return key in photos;
}
