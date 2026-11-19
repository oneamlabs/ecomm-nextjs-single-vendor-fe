import { serverApi } from "@/lib/api";
import { HeaderClient } from "./header-client";

export async function SiteHeader() {
  const { items: categories } = await serverApi.getCategories();
  return <HeaderClient categories={categories} />;
}
