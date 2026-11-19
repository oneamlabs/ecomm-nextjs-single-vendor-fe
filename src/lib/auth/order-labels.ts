import "server-only";

import { serverApi } from "@/lib/api";
import type { CartLine } from "@/lib/cart-store";

/**
 * Order lines store product and variant ids, not names. Resolving them here keeps
 * the mock order records honest (they reference products, they don't duplicate
 * their names) while giving the page a readable label.
 */
export interface OrderItemLabel {
  label: string;
  quantity: number;
}

export async function readOrderItemLabels(
  lines: CartLine[],
): Promise<Record<string, OrderItemLabel>> {
  if (lines.length === 0) return {};

  const { items: products } = await serverApi.listProducts({ pageSize: 48 });
  const byId = new Map(products.map((product) => [product.id, product]));

  const labels: Record<string, OrderItemLabel> = {};
  for (const line of lines) {
    const key = `${line.productId}::${line.variantId}`;
    if (labels[key]) continue;

    const product = byId.get(line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId);

    labels[key] = {
      label: product
        ? variant
          ? `${product.name} · ${variant.label}`
          : product.name
        : line.productId.replace(/-/g, " "),
      quantity: line.quantity,
    };
  }

  return labels;
}
