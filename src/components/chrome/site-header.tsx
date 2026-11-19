import { getCategories } from "@/lib/catalogue";
import { HeaderClient } from "./header-client";

export function SiteHeader() {
  return <HeaderClient categories={getCategories()} />;
}
