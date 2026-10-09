import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const paths = JSON.parse(await readFile(".next/server/app-paths-manifest.json", "utf8"));
const server = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
assert.notEqual(server.config.output, "export", "Vercel must use the native Next.js server build");
assert.ok(paths["/api/[...path]/route"], "Native Next API entrypoint is missing");
for (const route of ["/[locale]/page", "/[locale]/contact/page", "/[locale]/checkout/page", "/sitemap.xml/route"]) {
  assert.ok(paths[route], `Missing native route: ${route}`);
}
const entry = await readFile(`.next/server/${paths["/api/[...path]/route"]}`, "utf8");
assert.ok(entry.length > 100);
const prerender = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
for (const route of ["/en", "/zh", "/en/contact", "/zh/checkout", "/sitemap.xml"]) {
  assert.ok(prerender.routes[route], `Missing prerendered page: ${route}`);
}
for (const locale of ["en", "zh"]) {
  assert.match(await readFile(`.next/server/app/${locale}/privacy.html`, "utf8"), /Vercel/);
}
console.log("Vercel build check passed: native Next.js API, bilingual pages and sitemap. Account deployment is not implied.");
