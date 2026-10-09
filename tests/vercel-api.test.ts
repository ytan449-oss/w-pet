import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { migrateLocal, sqliteBinding } from "../db/local";
import { remoteDatabase } from "../db/remote";
import { handleNodeApi, type NodeApiEnv } from "../src/server/node-api";
import { privacyPolicyForHost } from "../src/config/privacy-host";
import { privacyPolicy } from "../src/config/privacy";

const origin = "https://wpet-fixture.vercel.app";
const env: NodeApiEnv = { VERCEL: "1", VERCEL_URL: "wpet-fixture.vercel.app", VERCEL_BRANCH_URL: "wpet-fixture-branch.vercel.app", PAYMENT_MODE: "test", CHECKOUT_SIGNING_SECRET: "native-api-fixture-signing-secret-32-characters" };
const request = (path: string, value?: unknown, extra = {}, at = origin) => new Request(at + path, {
  ...(value === undefined ? {} : { method: "POST", body: JSON.stringify(value) }),
  headers: { origin: at, "content-type": "application/json", "x-vercel-forwarded-for": "192.0.2.8", ...extra },
});
const inquiry = () => ({ name: "Native test", email: "native@example.test", topic: "custom-colours", locale: "zh", message: "This is a native API storage verification message.", consent: true, website: "", clientRequestId: crypto.randomUUID() });

test("Native API configuration is safe when merchant and database credentials are absent", async () => {
  assert.deepEqual(await (await handleNodeApi(request("/api/checkout/config/"), env)).json(), { mode: "test", stripe: false, paypal: false });
  assert.deepEqual(await (await handleNodeApi(request("/api/contact/config"), env)).json(), { available: false });
  assert.equal((await handleNodeApi(request("/api/invented"), env)).status, 404);
  assert.equal((await handleNodeApi(request("/api/contact", inquiry()), env)).status, 503);
  assert.equal((await handleNodeApi(request("/api/contact/config"), {})).status, 503);
});

test("Native contact adapter saves and deduplicates against generated SQL, including trailing-slash routes", async () => {
  const sqlite = new DatabaseSync(":memory:"); migrateLocal(sqlite);
  const dependencies = { database: sqliteBinding(sqlite) };
  try {
    const value = inquiry();
    const first = await handleNodeApi(request("/api/contact/", value), env, dependencies);
    assert.equal(first.status, 201);
    const saved = await first.json();
    assert.equal(saved.saved, true);
    const repeated = await handleNodeApi(request("/api/contact", value), env, dependencies);
    assert.equal(repeated.status, 200); assert.deepEqual(await repeated.json(), saved);
    const row = sqlite.prepare("SELECT * FROM contact_inquiries").get()!;
    assert.equal(row.id, saved.reference); assert.equal(row.locale, "zh");
    assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM contact_inquiries").get()!.count, 1);
    assert.equal((await handleNodeApi(request("/api/contact", inquiry(), {}, "https://wpet-fixture-branch.vercel.app"), env, dependencies)).status, 201);
    assert.equal((await handleNodeApi(request("/api/contact", inquiry(), { origin: "https://other.example" }), env, dependencies)).status, 403);
  } finally { sqlite.close(); }
});

test("Spoofed Sites identity and Cloudflare IP headers cannot reset Vercel form rate limits", async () => {
  const sqlite = new DatabaseSync(":memory:"); migrateLocal(sqlite);
  const dependencies = { database: sqliteBinding(sqlite) };
  try {
    for (let i = 0; i < 6; i++) {
      const response = await handleNodeApi(request("/api/contact", inquiry(), { "oai-authenticated-user-id": `spoof-${i}`, "cf-connecting-ip": `192.0.2.${i}` }), env, dependencies);
      assert.equal(response.status, i < 5 ? 201 : 429);
    }
    const rates = sqlite.prepare("SELECT * FROM contact_rate_limits").all();
    assert.equal(rates.length, 1); assert.ok(!JSON.stringify(rates).includes("192.0.2"));
  } finally { sqlite.close(); }
});

test("Native Stripe create and confirmation keep trusted return URLs and signed-cookie verification", async () => {
  const nativeEnv = { ...env, STRIPE_SECRET_KEY: "sk_test_native_fixture" };
  const id = "cs_test_nativefixture";
  let nonce = "", reads = 0;
  const fetcher = (async (url, init) => {
    if (init?.method === "POST") {
      const params = new URLSearchParams(String(init.body));
      nonce = params.get("metadata[wpet_nonce]")!;
      assert.ok(params.get("success_url")!.startsWith(origin + "/zh/order-success/"));
      assert.equal(params.get("line_items[0][price_data][unit_amount]"), "100");
      return Response.json({ id, livemode: false, url: `https://checkout.stripe.com/c/pay/${id}` });
    }
    reads++; assert.equal(String(url), `https://api.stripe.com/v1/checkout/sessions/${id}`);
    return Response.json({ id, livemode: false, currency: "nzd", amount_total: 100, status: "complete", payment_status: "paid", metadata: { wpet_nonce: nonce } });
  }) as typeof fetch;
  const created = await handleNodeApi(request("/api/checkout/stripe/create/", { locale: "zh", items: [{ variantId: "ab-lightweight-200-pmh", quantity: 1 }] }), nativeEnv, { fetcher });
  assert.equal(created.status, 200);
  const cookie = created.headers.get("set-cookie")!.split(";")[0];
  const confirmed = await handleNodeApi(request("/api/checkout/stripe/confirm/", { reference: id }, { cookie }), nativeEnv, { fetcher });
  assert.equal(confirmed.status, 200); assert.equal((await confirmed.json()).status, "paid");
  assert.equal(reads, 1);
});

test("Native PayPal approval and repeated confirmation capture once through sandbox URLs", async () => {
  const nativeEnv = { ...env, PAYPAL_CLIENT_ID: "fixture-client", PAYPAL_CLIENT_SECRET: "fixture-secret" };
  const id = "PAYPALNATIVE12345";
  let nonce = "", captures = 0;
  const paid = () => ({ id, status: "COMPLETED", purchase_units: [{ custom_id: nonce, amount: { currency_code: "NZD", value: "1.00" }, payments: { captures: [{ status: "COMPLETED", amount: { currency_code: "NZD", value: "1.00" } }] } }] });
  const fetcher = (async (url, init) => {
    assert.ok(String(url).startsWith("https://api-m.sandbox.paypal.com/"));
    if (String(url).endsWith("/oauth2/token")) return Response.json({ access_token: "fixture-access" });
    if (String(url).endsWith("/capture")) {
      captures++; assert.equal(new Headers(init?.headers).get("PayPal-Request-Id"), `wpet-capture-${id}`);
      return Response.json(paid());
    }
    if (init?.method === "POST") {
      const order = JSON.parse(String(init.body)); nonce = order.purchase_units[0].custom_id;
      assert.equal(order.payment_source.paypal.experience_context.return_url, origin + "/en/order-success/?provider=paypal");
      return Response.json({ id, status: "PAYER_ACTION_REQUIRED", links: [{ rel: "payer-action", href: `https://www.sandbox.paypal.com/checkoutnow?token=${id}` }] });
    }
    return Response.json(captures ? paid() : { id, status: "APPROVED", purchase_units: [{ custom_id: nonce, amount: { currency_code: "NZD", value: "1.00" } }] });
  }) as typeof fetch;
  const created = await handleNodeApi(request("/api/checkout/paypal/create", { locale: "en", items: [{ variantId: "ab-standard-120-pmh", quantity: 1 }] }), nativeEnv, { fetcher });
  assert.equal(created.status, 200);
  const cookie = created.headers.get("set-cookie")!.split(";")[0];
  for (let i = 0; i < 2; i++) {
    const response = await handleNodeApi(request("/api/checkout/paypal/confirm", { reference: id }, { cookie }), nativeEnv, { fetcher });
    assert.equal(response.status, 200); assert.equal((await response.json()).status, "paid");
  }
  assert.equal(captures, 1);
});

test("Native privacy disclosure describes its hosting without mutating the Sites notice", () => {
  assert.equal(privacyPolicyForHost("sites"), privacyPolicy);
  const native = privacyPolicyForHost("vercel");
  assert.match(native.sections.find(section => section.id === "storage")!.paragraphs.en[0], /Vercel/);
  assert.match(privacyPolicy.sections.find(section => section.id === "storage")!.paragraphs.en[0], /ChatGPT Sites/);
  assert.deepEqual(native.sections.find(section => section.id === "collection"), privacyPolicy.sections.find(section => section.id === "collection"));
});

const remoteEnv = { CLOUDFLARE_ACCOUNT_ID: "a".repeat(32), CLOUDFLARE_D1_DATABASE_ID: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", CLOUDFLARE_D1_API_TOKEN: "fixture-token" };
test("Remote D1 binds parameters and batches server-owned SQL through the fixed provider endpoint", async () => {
  const calls: Record<string, unknown>[] = [];
  const db = remoteDatabase(remoteEnv, (async (url, init) => {
    assert.equal(String(url), `https://api.cloudflare.com/client/v4/accounts/${remoteEnv.CLOUDFLARE_ACCOUNT_ID}/d1/database/${remoteEnv.CLOUDFLARE_D1_DATABASE_ID}/query`);
    assert.equal(new Headers(init?.headers).get("authorization"), "Bearer fixture-token");
    const payload = JSON.parse(String(init?.body)); calls.push(payload);
    return Response.json({ success: true, result: (payload.batch ?? [payload]).map(() => ({ success: true, results: [{ count: 1 }] })) });
  }) as typeof fetch)!;
  assert.deepEqual(await db.prepare("SELECT ? AS count").bind(1).first(), { count: 1 });
  await db.batch([db.prepare("DELETE FROM contact_rate_limits WHERE expires_at<=?").bind(123), db.prepare("SELECT ?").bind("O'Reilly")]);
  assert.deepEqual(calls[0], { sql: "SELECT ? AS count", params: ["1"] });
  assert.deepEqual(calls[1], { batch: [{ sql: "DELETE FROM contact_rate_limits WHERE expires_at<=?", params: ["123"] }, { sql: "SELECT ?", params: ["O'Reilly"] }] });
});

test("Invalid remote configuration and provider failures never produce a false database success", async () => {
  assert.equal(remoteDatabase({}), undefined);
  assert.equal(remoteDatabase({ ...remoteEnv, CLOUDFLARE_ACCOUNT_ID: "../foreign-account" }), undefined);
  for (const response of [Response.json({ success: false, errors: [{ message: "private details" }] }), Response.json({ success: true, result: [{ success: false }] }), Response.json({ success: true, result: [] }), new Response("Unavailable", { status: 503 })]) {
    const db = remoteDatabase(remoteEnv, (async () => response) as typeof fetch)!;
    await assert.rejects(db.prepare("SELECT 1").all(), /contact_database_unavailable/);
  }
});
