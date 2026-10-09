import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { default: worker } = await import(pathToFileURL(path.resolve("dist/server/index.js")));
const origin = "https://wpet.test";
const request = (route, init) => worker.fetch(new Request(origin + route, init), {});
const exports = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (entry.name === "index.html") exports.push("/" + path.relative("out", directory).split(path.sep).join("/") + "/");
  }
}
await collect("out");
for (const route of exports) {
  const response = await request(route.replace(/^\/\//, "/"));
  assert.equal(response.status, 200, route);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(await response.text(), /<html/);
}
for (const route of ["/en/cart/", "/zh/checkout/", "/en/order-success/"]) {
  const response = await request(route, { headers: { rsc: "1" } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/x-component/);
  assert.ok((await response.text()).length > 100);
}
const image = await request("/images/leash-pink-mint-overview.webp");
assert.equal(image.status, 200);
assert.equal(image.headers.get("content-type"), "image/webp");
assert.ok((await image.arrayBuffer()).byteLength > 10000);
assert.equal((await request("/en/cart/", { method: "HEAD" })).body, null);
assert.equal((await request("/missing-product-route/")).status, 404);
assert.equal((await request("/en/cart/", { method: "POST" })).status, 405);
const configuration = await request("/api/checkout/config");
assert.deepEqual(await configuration.json(), { mode: "test", stripe: false, paypal: false });
const unconfigured = await request("/api/checkout/stripe/create", {
  method: "POST", headers: { origin, "content-type": "application/json" },
  body: JSON.stringify({ locale: "en", items: [{ variantId: "ab-standard-120-pmh", quantity: 1 }] }),
});
assert.equal(unconfigured.status, 503);
assert.deepEqual(await unconfigured.json(), { error: "payments_not_configured" });
console.log(`Worker smoke check passed: ${exports.length} HTML routes, RSC navigation, images and sandbox API.`);
