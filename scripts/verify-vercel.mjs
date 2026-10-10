import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const paths = JSON.parse(await readFile(".next/server/app-paths-manifest.json", "utf8"));
const server = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
assert.notEqual(server.config.output, "export", "Vercel must use the native Next.js server build");
assert.ok(server.config.pageExtensions.includes("ts"), "Native route.ts must be discoverable");
assert.ok(server.config.pageExtensions.every(extension => !extension.includes(".")), "Vercel route packaging requires standard file extensions");
assert.ok(paths["/api/[...path]/route"], "Native Next API entrypoint is missing");
for (const route of ["/[locale]/page", "/[locale]/contact/page", "/[locale]/checkout/page", "/[locale]/privacy/page", "/sitemap.xml/route"]) {
  assert.ok(paths[route], `Missing native route: ${route}`);
}
const entry = await readFile(`.next/server/${paths["/api/[...path]/route"]}`, "utf8");
assert.ok(entry.length > 100);
const prerender = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
for (const route of ["/en", "/zh", "/en/contact", "/zh/checkout", "/en/privacy", "/zh/privacy", "/sitemap.xml"]) {
  assert.ok(prerender.routes[route], `Missing prerendered page: ${route}`);
}
// Vercel can rearrange prerendered HTML; its on-disk pathname is not a hosting contract.
// Host-specific policy content is covered by tests and must be checked at its served URL.
console.log("Vercel build check passed: native Next.js API, bilingual pages, privacy routes and sitemap. Check served policy content after deployment; account deployment is not implied.");
