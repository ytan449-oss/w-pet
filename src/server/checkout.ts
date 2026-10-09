import { cartLines, cartTotal, normalizeCart, type CartItem } from "../lib/cart";
import { variantLabel } from "../lib/product";
import type { Locale } from "../types/catalog";
import type { PaymentAvailability, PaymentProvider, PaymentReceipt } from "../types/checkout";

export interface CheckoutEnv {
  PAYMENT_MODE?: string;
  WPET_SITE_ORIGIN?: string;
  CHECKOUT_SIGNING_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
}
interface Dependencies { fetcher?: typeof fetch; now?: () => number; nonce?: () => string; }
interface Claims { provider: PaymentProvider; reference: string; nonce: string; items: CartItem[]; amountMinor: number; expires: number; }
interface StripeSession { id: string; url?: string; livemode: boolean; amount_total: number | null; currency: string; payment_status: string; status: string; metadata?: Record<string,string>; }
interface Money { currency_code: string; value: string; }
interface PayPalUnit { custom_id?: string; amount?: Money; payments?: { captures?: { status: string; amount: Money }[] }; }
interface PayPalOrder { id: string; status: string; purchase_units?: PayPalUnit[]; links?: { rel: string; href: string }[]; }
const PAYPAL_API = "https://api-m.sandbox.paypal.com";
const encoder = new TextEncoder();
class ApiError extends Error { constructor(public status: number, public code: string) { super(code); } }

function json(value: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(value), {status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...headers}});
}
export function paymentAvailability(env: CheckoutEnv): PaymentAvailability {
  const enabled = env.PAYMENT_MODE === "test" && (env.CHECKOUT_SIGNING_SECRET?.length ?? 0) >= 32;
  return { mode:"test", stripe:enabled && !!env.STRIPE_SECRET_KEY?.startsWith("sk_test_"), paypal:enabled && !!env.PAYPAL_CLIENT_ID && !!env.PAYPAL_CLIENT_SECRET };
}
function originFor(request: Request, env: CheckoutEnv) {
  try { return new URL(env.WPET_SITE_ORIGIN || request.url).origin; }
  catch { throw new ApiError(503,"payments_not_configured"); }
}
function sameOrigin(request: Request, env: CheckoutEnv) {
  if (request.headers.get("origin") !== originFor(request,env)) throw new ApiError(403,"invalid_origin");
}
async function body(request: Request): Promise<Record<string,unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new ApiError(415,"invalid_content_type");
  const text = await request.text();
  if (text.length > 16000) throw new ApiError(413,"request_too_large");
  try { const value = JSON.parse(text); if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(); return value; }
  catch { throw new ApiError(400,"invalid_request"); }
}
function requestedCart(input: Record<string,unknown>) {
  let items: CartItem[];
  try { items=normalizeCart(input.items); } catch { throw new ApiError(400,"invalid_cart"); }
  if (!items.length) throw new ApiError(400,"empty_cart");
  if (input.locale !== "en" && input.locale !== "zh") throw new ApiError(400,"invalid_locale");
  return {items,locale:input.locale as Locale};
}
function requireProvider(provider: PaymentProvider, env: CheckoutEnv) {
  if (!paymentAvailability(env)[provider]) throw new ApiError(503,"payments_not_configured");
}
async function providerJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new ApiError(502,"payment_provider_unavailable");
  try { return await response.json() as T; } catch { throw new ApiError(502,"invalid_provider_response"); }
}
function base64url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
function fromBase64url(value: string) { return Uint8Array.from(atob(value.replace(/-/g,"+").replace(/_/g,"/")), c=>c.charCodeAt(0)); }
async function signingKey(env: CheckoutEnv) {
  if ((env.CHECKOUT_SIGNING_SECRET?.length ?? 0)<32) throw new ApiError(503,"payments_not_configured");
  return crypto.subtle.importKey("raw",encoder.encode(env.CHECKOUT_SIGNING_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);
}
const cookieName = (provider: PaymentProvider) => `wpet_${provider}_checkout_test`;
async function checkoutCookie(claims: Claims, request: Request, env: CheckoutEnv) {
  const data=encoder.encode(JSON.stringify(claims));
  const signature=await crypto.subtle.sign("HMAC",await signingKey(env),data);
  return `${cookieName(claims.provider)}=${base64url(data)}.${base64url(new Uint8Array(signature))}; HttpOnly; SameSite=Lax; Path=/api/; Max-Age=3600${originFor(request,env).startsWith("https:") ? "; Secure" : ""}`;
}
async function readClaims(request: Request, env: CheckoutEnv, provider: PaymentProvider, reference: unknown, now: number): Promise<Claims> {
  try {
    const cookie=request.headers.get("cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith(`${cookieName(provider)}=`));
    const token=cookie?.slice(cookie.indexOf("=")+1);
    if (!token || token.length>6000) throw new Error();
    const parts=token.split("."); if(parts.length!==2) throw new Error();
    const data=fromBase64url(parts[0]); const signature=fromBase64url(parts[1]);
    if (!await crypto.subtle.verify("HMAC",await signingKey(env),signature,data)) throw new Error();
    const claims=JSON.parse(new TextDecoder().decode(data)) as Claims;
    if (claims.provider!==provider || claims.reference!==reference || !Number.isFinite(claims.expires) || claims.expires<now || typeof claims.nonce!=="string") throw new Error();
    claims.items=normalizeCart(claims.items);
    if (!claims.items.length || cartTotal(claims.items)!==claims.amountMinor) throw new Error();
    return claims;
  } catch { throw new ApiError(403,"checkout_session_mismatch"); }
}
function validRedirect(value: string | undefined, hosts: string[]) {
  try { const url=new URL(value!); if(url.protocol!=="https:" || !hosts.includes(url.hostname) || url.username || url.password || url.port) throw new Error(); return url.href; }
  catch { throw new ApiError(502,"invalid_provider_response"); }
}
function receipt(claims: Claims, status: PaymentReceipt["status"]): PaymentReceipt {
  return {provider:claims.provider,status,testMode:true,reference:claims.reference,amountMinor:claims.amountMinor,currency:"NZD",items:claims.items};
}
async function paypalToken(env: CheckoutEnv, fetcher: typeof fetch) {
  const result=await providerJson<{access_token:string}>(await fetcher(`${PAYPAL_API}/v1/oauth2/token`,{method:"POST",headers:{authorization:`Basic ${btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`)}`,"content-type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",signal:AbortSignal.timeout(15000)}));
  if(typeof result.access_token!=="string" || !result.access_token) throw new ApiError(502,"invalid_provider_response");
  return result.access_token;
}
function moneyMinor(money: Money | undefined) {
  if(money?.currency_code!=="NZD" || !/^\d+\.\d{2}$/.test(money.value)) throw new ApiError(409,"payment_amount_mismatch");
  const [major,minor]=money.value.split("."); return Number(major)*100+Number(minor);
}
function validatePayPalOrder(order: PayPalOrder, claims: Claims, requireNonce=true) {
  const unit=order.purchase_units?.[0];
  if(order.id!==claims.reference || order.purchase_units?.length!==1 || !unit || (requireNonce && unit.custom_id!==claims.nonce) || (unit.custom_id && unit.custom_id!==claims.nonce)) throw new ApiError(409,"checkout_session_mismatch");
  if (unit.amount && moneyMinor(unit.amount)!==claims.amountMinor) throw new ApiError(409,"payment_amount_mismatch");
  return unit;
}
function paidPayPal(order: PayPalOrder, claims: Claims, requireNonce=true) {
  const unit=validatePayPalOrder(order,claims,requireNonce);
  const captures=unit.payments?.captures;
  if(order.status!=="COMPLETED" || !captures?.length || captures.some(x=>x.status!=="COMPLETED")) throw new ApiError(409,"payment_not_completed");
  if(captures.reduce((sum,c)=>sum+moneyMinor(c.amount),0)!==claims.amountMinor) throw new ApiError(409,"payment_amount_mismatch");
  return receipt(claims,"paid");
}

/** All payment operations are sandbox-only. Real fulfillment is outside this flow. */
export async function handleCheckout(request: Request, env: CheckoutEnv, dependencies: Dependencies={}): Promise<Response> {
  const path=new URL(request.url).pathname;
  const fetcher=dependencies.fetcher ?? fetch;
  const now=dependencies.now?.() ?? Date.now();
  try {
    if(path==="/api/checkout/config" && request.method==="GET") return json(paymentAvailability(env));
    if(request.method!=="POST") return json({error:"method_not_allowed"},405,{allow:"POST"});
    sameOrigin(request,env);
    const input=await body(request);
    if(path==="/api/checkout/stripe/create" || path==="/api/checkout/paypal/create") {
      const provider: PaymentProvider=path.includes("/stripe/") ? "stripe" : "paypal";
      requireProvider(provider,env);
      const {items,locale}=requestedCart(input);
      const nonce=dependencies.nonce?.() ?? crypto.randomUUID();
      const amountMinor=cartTotal(items);
      const origin=originFor(request,env);
      const cancelUrl=`${origin}/${locale}/checkout/?cancelled=1`;
      let reference: string; let url: string;
      if(provider==="stripe") {
        const params=new URLSearchParams({mode:"payment",success_url:`${origin}/${locale}/order-success/?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,cancel_url:cancelUrl,"payment_method_types[0]":"card","metadata[wpet_nonce]":nonce,"metadata[wpet_mode]":"test",client_reference_id:nonce,expires_at:String(Math.floor(now/1000)+3600)});
        cartLines(items).forEach((line,index)=>{
          const prefix=`line_items[${index}]`;
          params.set(`${prefix}[quantity]`,String(line.quantity));
          params.set(`${prefix}[price_data][currency]`,"nzd");
          params.set(`${prefix}[price_data][unit_amount]`,String(line.unitAmountMinor));
          params.set(`${prefix}[price_data][product_data][name]`,`${line.product.name[locale]} — ${variantLabel(line.product,line.variant,locale)} (TEST)`);
        });
        const session=await providerJson<StripeSession>(await fetcher("https://api.stripe.com/v1/checkout/sessions",{method:"POST",headers:{authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,"content-type":"application/x-www-form-urlencoded","idempotency-key":`wpet-${nonce}`},body:params.toString(),signal:AbortSignal.timeout(15000)}));
        if(!/^cs_test_[A-Za-z0-9_]+$/.test(session.id) || session.livemode!==false) throw new ApiError(502,"invalid_provider_response");
        reference=session.id; url=validRedirect(session.url,["checkout.stripe.com"]);
      } else {
        const token=await paypalToken(env,fetcher);
        const order=await providerJson<PayPalOrder>(await fetcher(`${PAYPAL_API}/v2/checkout/orders`,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json","PayPal-Request-Id":`wpet-create-${nonce}`,Prefer:"return=representation"},body:JSON.stringify({intent:"CAPTURE",purchase_units:[{custom_id:nonce,description:"W Pet sandbox checkout — no real order",amount:{currency_code:"NZD",value:(amountMinor/100).toFixed(2),breakdown:{item_total:{currency_code:"NZD",value:(amountMinor/100).toFixed(2)}}},items:cartLines(items).map(line=>({name:`${line.product.name.en} — ${variantLabel(line.product,line.variant,"en")}`.slice(0,127),sku:line.variantId,quantity:String(line.quantity),unit_amount:{currency_code:"NZD",value:(line.unitAmountMinor/100).toFixed(2)},category:"PHYSICAL_GOODS"}))}],payment_source:{paypal:{experience_context:{brand_name:"W Pet",user_action:"PAY_NOW",shipping_preference:"NO_SHIPPING",return_url:`${origin}/${locale}/order-success/?provider=paypal`,cancel_url:cancelUrl}}}}),signal:AbortSignal.timeout(15000)}));
        if(!/^[A-Z0-9]{8,32}$/.test(order.id)) throw new ApiError(502,"invalid_provider_response");
        reference=order.id; url=validRedirect(order.links?.find(x=>x.rel==="payer-action" || x.rel==="approve")?.href,["www.sandbox.paypal.com","sandbox.paypal.com"]);
      }
      const claims: Claims={provider,reference,nonce,items,amountMinor,expires:now+3600000};
      return json({provider,url,testMode:true},200,{"set-cookie":await checkoutCookie(claims,request,env)});
    }
    if(path==="/api/checkout/stripe/confirm") {
      requireProvider("stripe",env);
      const claims=await readClaims(request,env,"stripe",input.reference,now);
      const session=await providerJson<StripeSession>(await fetcher(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(claims.reference)}`,{headers:{authorization:`Bearer ${env.STRIPE_SECRET_KEY}`},signal:AbortSignal.timeout(15000)}));
      if(session.id!==claims.reference || session.livemode!==false || session.metadata?.wpet_nonce!==claims.nonce) throw new ApiError(409,"checkout_session_mismatch");
      if(session.amount_total!==claims.amountMinor || session.currency!=="nzd") throw new ApiError(409,"payment_amount_mismatch");
      return json(receipt(claims,session.status==="complete" && session.payment_status==="paid" ? "paid" : session.status==="expired" ? "expired" : "pending"));
    }
    if(path==="/api/checkout/paypal/confirm") {
      requireProvider("paypal",env);
      const claims=await readClaims(request,env,"paypal",input.reference,now);
      const token=await paypalToken(env,fetcher);
      const headers={authorization:`Bearer ${token}`,"content-type":"application/json",Prefer:"return=representation"};
      const order=await providerJson<PayPalOrder>(await fetcher(`${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(claims.reference)}`,{headers,signal:AbortSignal.timeout(15000)}));
      const unit=validatePayPalOrder(order,claims);
      if(order.status==="COMPLETED") return json(paidPayPal(order,claims));
      if(!unit.amount || moneyMinor(unit.amount)!==claims.amountMinor) throw new ApiError(409,"payment_amount_mismatch");
      if(order.status!=="APPROVED") return json(receipt(claims,"pending"));
      const captured=await providerJson<PayPalOrder>(await fetcher(`${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(claims.reference)}/capture`,{method:"POST",headers:{...headers,"PayPal-Request-Id":`wpet-capture-${claims.reference}`},body:"{}",signal:AbortSignal.timeout(15000)}));
      return json(paidPayPal(captured,claims,false));
    }
    return json({error:"not_found"},404);
  } catch(error) {
    return json({error:error instanceof ApiError ? error.code : "payment_provider_unavailable"},error instanceof ApiError ? error.status : 502);
  }
}
