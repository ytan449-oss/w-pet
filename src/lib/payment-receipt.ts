import { cartTotal, normalizeCart, type CartItem } from "./cart";
import type { PaymentProvider, PaymentReceipt } from "../types/checkout";

export function verifiedReceipt(value: unknown, provider: PaymentProvider, reference: string): PaymentReceipt {
  if (!value || typeof value !== "object") throw new Error("invalid_receipt");
  const raw = value as Partial<PaymentReceipt>;
  const items = normalizeCart(raw.items);
  if (raw.provider !== provider || raw.reference !== reference || raw.testMode !== true || raw.currency !== "NZD"
      || !["paid", "pending", "expired"].includes(raw.status ?? "") || !items.length || raw.amountMinor !== cartTotal(items)) {
    throw new Error("invalid_receipt");
  }
  return { provider, reference, status: raw.status!, testMode: true, currency: "NZD", amountMinor: raw.amountMinor!, items };
}

/** Keep items added after checkout, subtracting only the purchased quantities. */
export function removePurchasedItems(current: CartItem[], purchased: CartItem[]): CartItem[] {
  const quantities = new Map(normalizeCart(purchased).map(item => [item.variantId, item.quantity]));
  return normalizeCart(current).flatMap(item => {
    const quantity = Math.max(0, item.quantity - (quantities.get(item.variantId) ?? 0));
    return quantity ? [{ ...item, quantity }] : [];
  });
}
