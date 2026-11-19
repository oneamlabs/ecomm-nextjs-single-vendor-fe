import assert from "node:assert/strict";
import test from "node:test";

import type { CartLine } from "../src/lib/cart-store.ts";

/**
 * jsdom is not installed, so the store is exercised against a minimal
 * localStorage shim. This is enough to cover validation, bounds, dedupe and
 * migration, which is the logic that actually protects the basket.
 */
class MemoryStorage {
  #data = new Map<string, string>();

  get length() {
    return this.#data.size;
  }

  key(index: number) {
    return [...this.#data.keys()][index] ?? null;
  }

  getItem(key: string) {
    return this.#data.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.#data.set(key, String(value));
  }

  removeItem(key: string) {
    this.#data.delete(key);
  }

  clear() {
    this.#data.clear();
  }
}

function freshStore(key: string, seed?: unknown) {
  const storage = new MemoryStorage();
  if (seed !== undefined) {
    storage.setItem(key, JSON.stringify(seed));
  }
  globalThis.window = { localStorage: storage } as unknown as Window & typeof globalThis;
  return storage;
}

const loadCart = () =>
  import(`../src/lib/cart-store.ts?t=${Math.random()}`) as Promise<
    typeof import("../src/lib/cart-store.ts")
  >;

const loadWishlist = () =>
  import(`../src/lib/wishlist-store.ts?t=${Math.random()}`) as Promise<
    typeof import("../src/lib/wishlist-store.ts")
  >;

test("adds a line and does not duplicate the same product and variant", async () => {
  freshStore("kraya-cart");
  const store = await loadCart();
  store.addCartLine("organic-red-quinoa", "500g", 1);
  store.addCartLine("organic-red-quinoa", "500g", 2);
  const lines = store.getCartSnapshot();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].quantity, 3);
});

test("bounds quantity at the maximum", async () => {
  freshStore("kraya-cart");
  const store = await loadCart();
  store.addCartLine("a2-desi-ghee", "1l", 1);
  store.setCartQuantity("a2-desi-ghee", "1l", 999);
  assert.equal(store.getCartSnapshot()[0].quantity, store.MAX_LINE_QUANTITY);
});

test("dropping quantity below one removes the line", async () => {
  freshStore("kraya-cart");
  const store = await loadCart();
  store.addCartLine("a2-desi-ghee", "1l", 1);
  store.setCartQuantity("a2-desi-ghee", "1l", 0);
  assert.equal(store.getCartSnapshot().length, 0);
});

test("ignores invalid add arguments", async () => {
  freshStore("kraya-cart");
  const store = await loadCart();
  store.addCartLine("", "1l", 1);
  store.addCartLine("a2-desi-ghee", "1l", 0);
  assert.equal(store.getCartSnapshot().length, 0);
});

test("migrates a legacy bare-array cart payload", async () => {
  freshStore("kraya-cart", [
    { productId: "rolled-oats", variantId: "1kg", quantity: 2 },
  ]);
  const store = await loadCart();
  const expected: CartLine[] = [
    { productId: "rolled-oats", variantId: "1kg", quantity: 2 },
  ];
  assert.deepEqual(store.getCartSnapshot(), expected);
});

test("discards corrupted cart entries but keeps valid ones", async () => {
  freshStore("kraya-cart", [
    { productId: "rolled-oats", variantId: "1kg", quantity: 2 },
    { productId: 42, variantId: "1kg", quantity: 1 },
    { productId: "mixed-nuts", variantId: "250g", quantity: -5 },
  ]);
  const store = await loadCart();
  const lines = store.getCartSnapshot();
  assert.equal(lines.length, 1);
  assert.equal(lines[0].productId, "rolled-oats");
});

test("handles unparseable cart storage without throwing", async () => {
  const storage = new MemoryStorage();
  storage.setItem("kraya-cart", "{not json");
  globalThis.window = { localStorage: storage } as unknown as Window & typeof globalThis;
  const store = await loadCart();
  assert.deepEqual(store.getCartSnapshot(), []);
});

test("cart persists a versioned envelope and summaries quantities", async () => {
  const storage = freshStore("kraya-cart");
  const store = await loadCart();
  store.addCartLine("rolled-oats", "1kg", 2);
  store.addCartLine("mixed-nuts", "250g", 1);

  const raw = JSON.parse(storage.getItem("kraya-cart") ?? "{}");
  assert.equal(raw.version, 2);
  assert.equal(raw.lines.length, 2);

  assert.deepEqual(store.summariseCart(store.getCartSnapshot()), {
    totalQuantity: 3,
    itemCount: 2,
  });

  store.removeCartLine("rolled-oats", "1kg");
  assert.equal(store.getCartSnapshot().length, 1);
});

test("cart clear empties the stored basket", async () => {
  const storage = freshStore("kraya-cart");
  const store = await loadCart();
  store.addCartLine("rolled-oats", "1kg", 1);
  store.clearCart();
  assert.deepEqual(store.getCartSnapshot(), []);
  assert.deepEqual(JSON.parse(storage.getItem("kraya-cart") ?? "{}").lines, []);
});

// --- saved list -------------------------------------------------------------

test("saved list toggles an id on and off", async () => {
  freshStore("kraya-wishlist");
  const store = await loadWishlist();
  store.toggleWishlist("wild-forest-honey");
  assert.deepEqual(store.getWishlistSnapshot(), ["wild-forest-honey"]);
  store.toggleWishlist("wild-forest-honey");
  assert.deepEqual(store.getWishlistSnapshot(), []);
});

test("saveToWishlist is idempotent", async () => {
  freshStore("kraya-wishlist");
  const store = await loadWishlist();
  store.saveToWishlist("wild-forest-honey");
  store.saveToWishlist("wild-forest-honey");
  assert.deepEqual(store.getWishlistSnapshot(), ["wild-forest-honey"]);
});

test("saved list rejects malformed ids", async () => {
  freshStore("kraya-wishlist");
  const store = await loadWishlist();
  store.saveToWishlist("");
  store.saveToWishlist("   ");
  store.saveToWishlist("has spaces");
  store.saveToWishlist("x".repeat(200));
  store.saveToWishlist("ok-id_1.2");
  assert.deepEqual(store.getWishlistSnapshot(), ["ok-id_1.2"]);
});

test("saved list migrates a legacy bare-array payload", async () => {
  freshStore("kraya-wishlist", ["rolled-oats", "wild-forest-honey"]);
  const store = await loadWishlist();
  assert.deepEqual(store.getWishlistSnapshot(), [
    "rolled-oats",
    "wild-forest-honey",
  ]);
});

test("saved list drops corrupted entries and duplicates", async () => {
  freshStore("kraya-wishlist", [
    "rolled-oats",
    42,
    "rolled-oats",
    "",
    "wild-forest-honey",
  ]);
  const store = await loadWishlist();
  assert.deepEqual(store.getWishlistSnapshot(), [
    "rolled-oats",
    "wild-forest-honey",
  ]);
});

test("saved list caps the number of stored ids", async () => {
  freshStore("kraya-wishlist");
  const store = await loadWishlist();
  for (let index = 0; index < store.MAX_SAVED + 25; index += 1) {
    store.saveToWishlist(`product-${index}`);
  }
  assert.equal(store.getWishlistSnapshot().length, store.MAX_SAVED);
});

test("saved list handles unparseable storage without throwing", async () => {
  const storage = new MemoryStorage();
  storage.setItem("kraya-wishlist", "not json at all");
  globalThis.window = { localStorage: storage } as unknown as Window & typeof globalThis;
  const store = await loadWishlist();
  assert.deepEqual(store.getWishlistSnapshot(), []);
});

test("saved list persists a versioned envelope", async () => {
  const storage = freshStore("kraya-wishlist");
  const store = await loadWishlist();
  store.saveToWishlist("rolled-oats");
  const raw = JSON.parse(storage.getItem("kraya-wishlist") ?? "{}");
  assert.equal(raw.version, 2);
  assert.deepEqual(raw.ids, ["rolled-oats"]);
});
