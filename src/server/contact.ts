import { contactNoticeVersion, isContactTopic } from "../config/contact";
import type { ContactDatabase } from "../types/database";

export interface ContactEnv { DB?: ContactDatabase; WPET_SITE_ORIGIN?: string; CHECKOUT_SIGNING_SECRET?: string; }
interface Dependencies { now?: () => number; reference?: () => string; }
class ContactError extends Error {
  constructor(public status: number, public code: string, public retryAfter?: number) { super(code); }
}
const encoder = new TextEncoder();
function json(value: unknown, status = 200, retryAfter?: number) {
  return new Response(JSON.stringify(value), { status, headers: {
    "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff",
    ...(retryAfter ? { "retry-after": String(retryAfter) } : {}),
  } });
}
const configured = (env: ContactEnv) => !!env.DB && (env.CHECKOUT_SIGNING_SECRET?.length ?? 0) >= 32;
async function inputBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new ContactError(415, "invalid_content_type");
  const reader = request.body?.getReader();
  if (!reader) throw new ContactError(400, "invalid_request");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 12000) { await reader.cancel(); throw new ContactError(413, "request_too_large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try {
    const value = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch { throw new ContactError(400, "invalid_request"); }
}
function text(value: unknown, min: number, max: number) {
  if (typeof value !== "string") throw new ContactError(400, "invalid_fields");
  const clean = value.trim();
  if (clean.length < min || clean.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(clean)) throw new ContactError(400, "invalid_fields");
  return clean;
}
function validate(raw: Record<string, unknown>) {
  const name = text(raw.name, 1, 80), email = text(raw.email, 3, 254), message = text(raw.message, 20, 2000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || raw.consent !== true || !isContactTopic(raw.topic)
      || (raw.locale !== "en" && raw.locale !== "zh") || typeof raw.clientRequestId !== "string"
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw.clientRequestId)
      || (raw.website !== "" && raw.website !== undefined)) throw new ContactError(400, "invalid_fields");
  return { name, email: email.toLowerCase(), message, topic: raw.topic, locale: raw.locale, clientRequestId: raw.clientRequestId };
}
async function digest(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))), n => n.toString(16).padStart(2, "0")).join("");
}

export async function handleContact(request: Request, env: ContactEnv, dependencies: Dependencies = {}): Promise<Response> {
  const url = new URL(request.url);
  try {
    if (url.pathname === "/api/contact/config" && request.method === "GET") return json({ available: configured(env) });
    if (url.pathname !== "/api/contact") return json({ error: "not_found" }, 404);
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    const expectedOrigin = new URL(env.WPET_SITE_ORIGIN || request.url).origin;
    if (request.headers.get("origin") !== expectedOrigin) throw new ContactError(403, "invalid_origin");
    if (!configured(env)) throw new ContactError(503, "contact_unavailable");
    const input = validate(await inputBody(request));
    const now = dependencies.now?.() ?? Date.now();
    const payloadHash = await digest(`inquiry:${JSON.stringify(input)}`, env.CHECKOUT_SIGNING_SECRET!);
    const db = env.DB!;
    const existing = await db.prepare("SELECT id, payload_hash FROM contact_inquiries WHERE client_request_id=?").bind(input.clientRequestId).first<{ id: string; payload_hash: string }>();
    if (existing) {
      if (existing.payload_hash !== payloadHash) throw new ContactError(409, "request_conflict");
      return json({ reference: existing.id, saved: true });
    }
    const window = Math.floor(now / 3600000), expires = (window + 1) * 3600000;
    const visitor = request.headers.get("oai-authenticated-user-id") || request.headers.get("cf-connecting-ip") || "anonymous";
    const rateKey = await digest(`contact-rate:${window}:${visitor}`, env.CHECKOUT_SIGNING_SECRET!);
    const reservation = await db.batch([
      db.prepare("DELETE FROM contact_rate_limits WHERE expires_at<=?").bind(now),
      db.prepare("INSERT INTO contact_rate_limits(id,count,expires_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 WHERE count<5 RETURNING count").bind(rateKey, expires),
    ]);
    if (!reservation[1]?.results?.length) throw new ContactError(429, "rate_limited", Math.max(1, Math.ceil((expires - now) / 1000)));
    const reference = dependencies.reference?.() ?? `WP-${crypto.randomUUID()}`;
    await db.prepare("INSERT INTO contact_inquiries(id,client_request_id,payload_hash,name,email,topic,message,locale,notice_version,created_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(client_request_id) DO NOTHING")
      .bind(reference, input.clientRequestId, payloadHash, input.name, input.email, input.topic, input.message, input.locale, contactNoticeVersion, now).run();
    const saved = await db.prepare("SELECT id, payload_hash FROM contact_inquiries WHERE client_request_id=?").bind(input.clientRequestId).first<{ id: string; payload_hash: string }>();
    if (!saved || saved.payload_hash !== payloadHash) throw new ContactError(409, "request_conflict");
    return json({ reference: saved.id, saved: true }, 201);
  } catch (error) {
    return json({ error: error instanceof ContactError ? error.code : "contact_unavailable" }, error instanceof ContactError ? error.status : 503, error instanceof ContactError ? error.retryAfter : undefined);
  }
}
