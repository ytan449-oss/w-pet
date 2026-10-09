import { test } from "node:test";
import assert from "node:assert/strict";
import { products } from "../src/config/products";
import { pageDescriptions } from "../src/config/seo";
import { localePath, pageRoutes, switchLocalePath } from "../src/lib/routing";
import { siteOrigin } from "../src/lib/site-origin";

test("Every declared locale route has a reciprocal language path with checkout and enquiry context intact", () => {
  const routes = [...pageRoutes, ...products.map(product => `products/${product.slug}`)];
  for (const path of routes) {
    const suffix = "?version=lightweight&length=200&topic=custom-colours&provider=paypal&token=TEST123#custom-colours";
    const en = localePath("en", path) + suffix, zh = localePath("zh", path) + suffix;
    assert.equal(switchLocalePath(en, "zh"), zh);
    assert.equal(switchLocalePath(zh, "en"), en);
  }
});

test("Page descriptions are distinct and complete for both languages", () => {
  for (const locale of ["en", "zh"] as const) {
    const descriptions = pageRoutes.map(path => pageDescriptions[path]?.[locale]);
    assert.ok(descriptions.every(value => value && value.trim().length > 20));
    assert.equal(new Set(descriptions).size, pageRoutes.length);
    for (const product of products) assert.ok(!descriptions.includes(product.description[locale]));
  }
});

test("Metadata uses the configured deployment origin without credentials or arbitrary URL suffixes", () => {
  assert.equal(siteOrigin({ VERCEL_URL: "wpet-preview.vercel.app" }), "https://wpet-preview.vercel.app");
  assert.equal(siteOrigin({ WPET_PUBLIC_SITE_URL: "https://wpet.example", VERCEL_URL: "preview.vercel.app" }), "https://wpet.example");
  assert.equal(siteOrigin({ WPET_PUBLIC_SITE_URL: "http://localhost:3000" }), "http://localhost:3000");
  for (const value of ["https://user:password@example.com", "https://example.com/path", "https://example.com/?q=x", "https://example.com/#x", "http://example.com", "ftp://example.com"]) {
    assert.throws(() => siteOrigin({ WPET_PUBLIC_SITE_URL: value }));
  }
});
