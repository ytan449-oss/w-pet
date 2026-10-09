import assert from "node:assert/strict";
import test from "node:test";
import { removePurchasedItems, verifiedReceipt } from "../src/lib/payment-receipt";

const items = [{ variantId: "ab-standard-120-pmh", quantity: 2 }];
const receipt = { provider: "stripe", reference: "cs_test_receipt", status: "paid", testMode: true, currency: "NZD", amountMinor: 200, items };

test("A receipt must match the returned provider, reference, catalog amount and sandbox mode", () => {
  assert.equal(verifiedReceipt(receipt, "stripe", receipt.reference).status, "paid");
  for (const changes of [{ reference: "foreign" }, { provider: "paypal" }, { amountMinor: 1 }, { testMode: false }, { currency: "USD" }, { status: "success" }]) {
    assert.throws(() => verifiedReceipt({ ...receipt, ...changes }, "stripe", receipt.reference));
  }
  assert.equal(verifiedReceipt({ ...receipt, status: "pending" }, "stripe", receipt.reference).status, "pending");
});
test("Paid-cart cleanup preserves additional quantities and unrelated selections", () => {
  assert.deepEqual(removePurchasedItems([
    { variantId: "ab-standard-120-pmh", quantity: 5 },
    { variantId: "ab-lightweight-200-pmh", quantity: 1 },
  ], items), [
    { variantId: "ab-standard-120-pmh", quantity: 3 },
    { variantId: "ab-lightweight-200-pmh", quantity: 1 },
  ]);
  assert.deepEqual(removePurchasedItems([{ variantId: "ab-standard-120-pmh", quantity: 1 }], items), []);
});
