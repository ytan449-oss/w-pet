import type { CartItem } from "../lib/cart";
export type PaymentProvider = "stripe" | "paypal";
export interface PaymentAvailability { mode: "test"; stripe: boolean; paypal: boolean; }
export interface PaymentReceipt {
  provider: PaymentProvider;
  status: "paid" | "pending" | "expired";
  testMode: true;
  reference: string;
  amountMinor: number;
  currency: "NZD";
  items: CartItem[];
}
