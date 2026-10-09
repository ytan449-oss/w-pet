import { remoteDatabase, type RemoteDatabaseEnv } from "../../db/remote";
import { handleContact, type ContactEnv } from "./contact";
import { handleCheckout, type CheckoutEnv } from "./checkout";
import { siteOrigin } from "../lib/site-origin";
import type { ContactDatabase } from "../types/database";

export interface NodeApiEnv extends CheckoutEnv, RemoteDatabaseEnv {
  [key: string]: string | undefined;
  VERCEL?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
}
const paths = new Set([
  "/api/contact", "/api/contact/config", "/api/checkout/config",
  "/api/checkout/stripe/create", "/api/checkout/stripe/confirm",
  "/api/checkout/paypal/create", "/api/checkout/paypal/confirm",
]);
interface Dependencies { database?: ContactDatabase; fetcher?: typeof fetch; }
const unavailable = () => Response.json({ error: "service_unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });

/** Native Next.js adapter. Worker/D1-bound hosting uses its existing entrypoint. */
export async function handleNodeApi(request: Request, env: NodeApiEnv = process.env, dependencies: Dependencies = {}): Promise<Response> {
  try {
    const url = new URL(request.url);
    url.pathname = url.pathname.replace(/\/+$/, "");
    if (!paths.has(url.pathname)) return Response.json({ error: "not_found" }, { status: 404 });
    const candidates = [env.WPET_SITE_ORIGIN, env.VERCEL_URL && `https://${env.VERCEL_URL}`, env.VERCEL_BRANCH_URL && `https://${env.VERCEL_BRANCH_URL}`].filter(Boolean) as string[];
    const allowed = candidates.map(value => siteOrigin({ WPET_PUBLIC_SITE_URL: value }));
    if (!allowed.length) return unavailable();
    const origin = allowed.includes(url.origin) ? url.origin : allowed[0];
    const headers = new Headers(request.headers);
    // These identity headers are trusted only behind Sites dispatch, never from Vercel visitors.
    headers.delete("oai-authenticated-user-id");
    headers.delete("oai-authenticated-user-email");
    headers.delete("cf-connecting-ip");
    if (env.VERCEL === "1") {
      const visitor = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for");
      if (visitor) headers.set("cf-connecting-ip", visitor);
    }
    const adapted = new Request(url, new Request(request, { headers }));
    const runtime: CheckoutEnv & ContactEnv = {
      ...env, WPET_SITE_ORIGIN: origin,
      DB: dependencies.database ?? remoteDatabase(env, dependencies.fetcher),
    };
    return url.pathname.startsWith("/api/contact")
      ? handleContact(adapted, runtime)
      : handleCheckout(adapted, runtime, { fetcher: dependencies.fetcher });
  } catch { return unavailable(); }
}
