import { test } from "node:test";
import assert from "node:assert/strict";
import { cartLines, cartTotal, normalizeCart } from "../src/lib/cart";

test("Duplicate selections merge and amounts come from the catalog", () => {
  const input = [{variantId:"ab-standard-120-pmh",quantity:2,price:1},{variantId:"ab-standard-120-pmh",quantity:3}];
  assert.deepEqual(normalizeCart(input), [{variantId:"ab-standard-120-pmh",quantity:5}]);
  assert.equal(cartTotal(input), 500);
  assert.equal(cartLines(input)[0].variant.breakingLoadKg, 400);
});
test("Unknown variants and malformed quantities cannot enter checkout", () => {
  for (const quantity of [0,-1,1.5,11,"1",null,NaN]) assert.throws(() => normalizeCart([{variantId:"ab-standard-120-pmh",quantity}]));
  assert.throws(() => normalizeCart([{variantId:"forged",quantity:1}]));
  assert.throws(() => normalizeCart([{variantId:"ab-standard-120-pmh",quantity:6},{variantId:"ab-standard-120-pmh",quantity:5}]));
  assert.throws(() => normalizeCart([{variantId:"ab-standard-120-pmh",quantity:10},{variantId:"ab-lightweight-120-pmh",quantity:10},{variantId:"ab-lightweight-200-pmh",quantity:1}]));
});
