export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

const STORAGE_KEY = "kraya-cart";
const LEGACY_KEY = "pantry-row-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Partial<CartLine>;
  if (typeof line.productId !== "string") return false;
  if (typeof line.variantId !== "string") return false;
  if (typeof line.quantity !== "number" || line.quantity < 1) return false;
  return true;
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem(LEGACY_KEY) ??
        "[]",
    );
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isCartLine);
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded) return;
  lines = readStorage();
  loaded = true;
}

function commit(next: CartLine[]) {
  lines = next;
  loaded = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartLine[] {
  ensureLoaded();
  return lines;
}

export function getServerCartSnapshot(): CartLine[] {
  return EMPTY;
}

export function addCartLine(productId: string, variantId: string, quantity = 1) {
  ensureLoaded();
  const existing = lines.find(
    (line) => line.productId === productId && line.variantId === variantId,
  );
  if (!existing) {
    commit([...lines, { productId, variantId, quantity }]);
    return;
  }
  commit(
    lines.map((line) =>
      line === existing ? { ...line, quantity: line.quantity + quantity } : line,
    ),
  );
}

export function setCartQuantity(
  productId: string,
  variantId: string,
  quantity: number,
) {
  ensureLoaded();
  const isSame = (line: CartLine) =>
    line.productId === productId && line.variantId === variantId;

  if (quantity < 1) {
    commit(lines.filter((line) => !isSame(line)));
    return;
  }
  commit(
    lines.map((line) => (isSame(line) ? { ...line, quantity } : line)),
  );
}

export function removeCartLine(productId: string, variantId: string) {
  ensureLoaded();
  commit(
    lines.filter(
      (line) => !(line.productId === productId && line.variantId === variantId),
    ),
  );
}

export function clearCart() {
  commit([]);
}

export function summariseCart(cartLines: CartLine[]) {
  let totalQuantity = 0;

  for (const line of cartLines) {
    totalQuantity += line.quantity;
  }

  return { totalQuantity, itemCount: cartLines.length };
}
