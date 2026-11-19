import { formatPrice, lineTotalCents } from "@/lib/money";
import type { CartLine } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

interface BasketLineListProps {
  lines: CartLine[];
  products: Product[];
}

export function BasketLineList({ lines, products }: BasketLineListProps) {
  const productById = new Map(products.map((product) => [product.id, product]));

  return (
    <ul className="mt-4 text-sm">
      {lines.map((line) => {
        const product = productById.get(line.productId);
        const variant = product?.variants.find((item) => item.id === line.variantId);
        if (!product || !variant) return null;

        return (
          <li
            key={`${line.productId}-${line.variantId}`}
            className="flex justify-between gap-4 border-t border-rule-2 py-2"
          >
            <span>
              {product.name}
              <span className="block text-muted">
                {variant.label} × {line.quantity}
              </span>
            </span>
            <span className="num shrink-0">
              {formatPrice(lineTotalCents(variant, line.quantity))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
