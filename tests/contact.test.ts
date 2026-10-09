import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { migrateLocal, sqliteBinding } from "../db/local";
import { handleContact, type ContactEnv } from "../src/server/contact";

const origin = "https://wpet.test", now = 1791568800000;
const valid = () => ({ name: "Contact test", email: "owner@example.test", topic: "custom-colours", locale: "en", message: "Please share the available custom colour process.", consent: true, website: "", clientRequestId: crypto.randomUUID() });
function setup() {
  const sqlite = new DatabaseSync(":memory:"); migrateLocal(sqlite);
  const env: ContactEnv = { DB: sqliteBinding(sqlite), CHECKOUT_SIGNING_SECRET: "contact-fixture-signing-secret-32-characters", WPET_SITE_ORIGIN: origin };
  const send = (value: unknown, headers = {}) => handleContact(new Request(origin + "/api/contact", { method: "POST", headers: { origin, "content-type": "application/json", "cf-connecting-ip": "192.0.2.1", ...headers }, body: JSON.stringify(value) }), env, { now: () => now });
  return { sqlite, env, send };
}
test("Contact requests are actually stored with a receipt and privacy-notice version", async () => {
  const { sqlite, send } = setup();
  const response = await send({ ...valid(), name: " Contact test ", email: "Owner@Example.test" });
  assert.equal(response.status, 201); const data = await response.json();
  assert.equal(data.saved, true); assert.match(data.reference, /^WP-/);
  const row = sqlite.prepare("SELECT * FROM contact_inquiries").get()!;
  assert.equal(row.id, data.reference); assert.equal(row.name, "Contact test"); assert.equal(row.email, "owner@example.test");
  assert.equal(row.notice_version, "2026-10-10"); assert.equal(row.topic, "custom-colours");
  assert.ok(!JSON.stringify(data).includes("owner@example.test")); sqlite.close();
});
test("Retrying the same inquiry returns the original reference without duplicate storage", async () => {
  const { sqlite, send } = setup(), input = valid();
  const first = await (await send(input)).json(); const retry = await send(input);
  assert.equal(retry.status, 200); assert.deepEqual(await retry.json(), first);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM contact_inquiries").get()!.count, 1);
  assert.equal((await send({ ...input, message: "An entirely different message using the same key." })).status, 409);
  sqlite.close();
});
test("Missing consent, malformed fields, spam traps and cross-origin requests never create inquiries", async () => {
  const { sqlite, send } = setup();
  for (const patch of [{ consent: false }, { email: "invalid" }, { message: "short" }, { topic: "invented" }, { locale: "fr" }, { clientRequestId: "bad-id" }, { website: "spam.example" }, { name: "   " }]) {
    assert.equal((await send({ ...valid(), ...patch })).status, 400);
  }
  assert.equal((await send(valid(), { origin: "https://foreign.test" })).status, 403);
  assert.equal((await send(valid(), { "content-type": "text/plain" })).status, 415);
  assert.equal((await send({ ...valid(), message: "x".repeat(13000) })).status, 413);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM contact_inquiries").get()!.count, 0); sqlite.close();
});
test("Rate limits are bounded and contain no raw IP or contact details", async () => {
  const { sqlite, send } = setup();
  for (let i = 0; i < 5; i++) assert.equal((await send(valid())).status, 201);
  const response = await send(valid()); assert.equal(response.status, 429); assert.ok(Number(response.headers.get("retry-after")) > 0);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM contact_inquiries").get()!.count, 5);
  const rate = sqlite.prepare("SELECT * FROM contact_rate_limits").get()!;
  assert.match(String(rate.id), /^[a-f0-9]{64}$/); assert.ok(!JSON.stringify(rate).includes("192.0.2.1"));
  assert.equal((await send(valid(), { "cf-connecting-ip": "192.0.2.2" })).status, 201); sqlite.close();
});
test("A missing or failing database never claims a saved inquiry", async () => {
  assert.deepEqual(await (await handleContact(new Request(origin + "/api/contact/config"), {})).json(), { available: false });
  const { env, sqlite } = setup();
  assert.deepEqual(await (await handleContact(new Request(origin + "/api/contact/config"), env)).json(), { available: true });
  const failing: ContactEnv = { ...env, DB: { prepare() { throw new Error("sensitive provider error"); }, async batch() { throw new Error(); } } };
  const response = await handleContact(new Request(origin + "/api/contact", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(valid()) }), failing);
  assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: "contact_unavailable" }); sqlite.close();
});
