import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
  className?: string;
  compact?: boolean;
}

export function ProductGrid({
  products,
  priorityCount = 0,
  className = "lg:grid-cols-3",
  compact = false,
}: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-[var(--gap-columns)] gap-y-12 sm:grid-cols-2 ${className}`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
          compact={compact}
        />
      ))}
    </div>
  );
}
