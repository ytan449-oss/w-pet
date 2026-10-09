import { products } from "../config/products";
import type { Product, ProductVariant } from "../types/catalog";

export interface CartItem { variantId: string; quantity: number; }
export interface CartLine extends CartItem { product: Product; variant: ProductVariant; unitAmountMinor: number; }
export const CART_KEY = "w-pet-test-cart-v1";
export const CART_EVENT = "w-pet-cart-change";

/** Only known variant IDs and bounded integer quantities are accepted. */
export function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value) || value.length > 10) throw new Error("invalid_cart");
  const merged = new Map<string, number>();
  for (const raw of value) {
    if (!raw || typeof raw !== "object") throw new Error("invalid_cart");
    const { variantId, quantity } = raw as Partial<CartItem>;
    if (typeof variantId !== "string" || !products.some(p => p.variants.some(v => v.id === variantId))) throw new Error("invalid_variant");
    if (!Number.isInteger(quantity) || typeof quantity !== "number" || quantity < 1 || quantity > 10) throw new Error("invalid_quantity");
    const combined = (merged.get(variantId) ?? 0) + quantity;
    if (combined > 10) throw new Error("quantity_limit");
    merged.set(variantId, combined);
  }
  const result = Array.from(merged, ([variantId, quantity]) => ({ variantId, quantity }));
  if (result.reduce((sum, item) => sum + item.quantity, 0) > 20) throw new Error("quantity_limit");
  return result;
}

export function cartLines(value: unknown): CartLine[] {
  return normalizeCart(value).map(item => {
    const product = products.find(p => p.variants.some(v => v.id === item.variantId))!;
    const variant = product.variants.find(v => v.id === item.variantId)!;
    return { ...item, product, variant, unitAmountMinor: product.testUnitAmountMinor };
  });
}
export const cartTotal = (value: unknown) => cartLines(value).reduce((sum, line) => sum + line.unitAmountMinor * line.quantity, 0);

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return normalizeCart(JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]")); }
  catch { return []; }
}
export function saveCart(items: CartItem[]) {
  const normalized = normalizeCart(items);
  window.localStorage.setItem(CART_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(CART_EVENT));
}
export function addToCart(variantId: string, quantity: number) {
  saveCart(normalizeCart([...loadCart(), { variantId, quantity }]));
}
