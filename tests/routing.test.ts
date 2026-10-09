import { test } from "node:test";
import assert from "node:assert/strict";
import { isLocale, localePath, switchLocalePath } from "../src/lib/routing";

test("English is the entry route and language switching preserves nested pages", () => {
  assert.equal(switchLocalePath("/", "zh"), "/zh/");
  assert.equal(switchLocalePath("/en/products/bloom-bandana-rose/", "zh"), "/zh/products/bloom-bandana-rose/");
  assert.equal(switchLocalePath("/zh/care-faq/", "en"), "/en/care-faq/");
});

test("Language switching preserves query parameters and anchors", () => {
  assert.equal(switchLocalePath("/en/collections/aotearoa-bloom/?sort=price#collection", "zh"), "/zh/collections/aotearoa-bloom/?sort=price#collection");
});

test("Unknown locale segments are not mistaken for a supported locale", () => {
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("zh"), true);
  assert.equal(isLocale("fr"), false);
  assert.equal(switchLocalePath("/english-story/", "zh"), "/zh/english-story/");
});

test("Localized paths normalize slashes", () => {
  assert.equal(localePath("en", "/cart/"), "/en/cart/");
  assert.equal(localePath("zh"), "/zh/");
});
