import { test } from "node:test";
import assert from "node:assert/strict";
import { handleCheckout, paymentAvailability, type CheckoutEnv } from "../src/server/checkout";

const ORIGIN="https://wpet.example";
const NOW=1800000000000;
const NONCE="checkout-test-nonce";
const STRIPE_ID="cs_test_fixture";
const PAYPAL_ID="PAYPALTEST12345678";
const env: CheckoutEnv={PAYMENT_MODE:"test",WPET_SITE_ORIGIN:ORIGIN,CHECKOUT_SIGNING_SECRET:"fixture-signing-secret-for-unit-tests-only",STRIPE_SECRET_KEY:"sk_test_fixture",PAYPAL_CLIENT_ID:"sandbox-fixture-client",PAYPAL_CLIENT_SECRET:"sandbox-fixture-secret"};
const cart={items:[{variantId:"ab-standard-120-pmh",quantity:2}],locale:"en"};
const reply=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{"content-type":"application/json"}});
function req(path:string,input:unknown=cart,cookie="",origin=ORIGIN) {
  return new Request(ORIGIN+path,{method:"POST",headers:{origin,"content-type":"application/json",cookie},body:JSON.stringify(input)});
}
function dependencies(fetcher:typeof fetch,now=NOW) {return {fetcher,now:()=>now,nonce:()=>NONCE};}
const cookieOf=(response:Response)=>response.headers.get("set-cookie")!.split(";")[0];

async function stripeCheckout() {
  const fetcher=(async (_url,init)=>{
    const params=new URLSearchParams(String(init?.body));
    assert.equal(params.get("line_items[0][price_data][unit_amount]"),"100");
    assert.equal(params.get("line_items[0][quantity]"),"2");
    assert.equal(params.get("line_items[0][price_data][currency]"),"nzd");
    assert.equal(params.get("metadata[wpet_nonce]"),NONCE);
    assert.equal(params.get("expires_at"),String(NOW/1000+3600));
    assert.match(params.get("success_url")!,/provider=stripe&session_id=\{CHECKOUT_SESSION_ID\}/);
    return reply({id:STRIPE_ID,url:`https://checkout.stripe.com/c/pay/${STRIPE_ID}`,livemode:false});
  }) as typeof fetch;
  const response=await handleCheckout(req("/api/checkout/stripe/create",{...cart,amount:1,price:1}),env,dependencies(fetcher));
  assert.equal(response.status,200);
  assert.match(response.headers.get("set-cookie")!,/HttpOnly; SameSite=Lax; Path=\/api\/; Max-Age=3600; Secure/);
  return cookieOf(response);
}

test("Provider readiness is test-only and does not expose credentials",async()=>{
  assert.deepEqual(paymentAvailability({}),{mode:"test",stripe:false,paypal:false});
  assert.equal(paymentAvailability({...env,STRIPE_SECRET_KEY:"sk_live_fixture"}).stripe,false);
  assert.deepEqual(paymentAvailability({...env,PAYMENT_MODE:"live"}),{mode:"test",stripe:false,paypal:false});
  const response=await handleCheckout(new Request(ORIGIN+"/api/checkout/config"),env);
  assert.deepEqual(await response.json(),{mode:"test",stripe:true,paypal:true});
});
test("Stripe creation recalculates amounts and binds checkout to an HttpOnly cookie",async()=>{await stripeCheckout();});
test("Empty/forged carts and cross-origin writes never reach a provider",async()=>{
  const fetcher=(async()=>{throw new Error("Provider must not be called");}) as typeof fetch;
  for(const payload of [{items:[],locale:"en"},{items:[{variantId:"fake",quantity:1}],locale:"en"},{...cart,locale:"fr"}]) {
    assert.equal((await handleCheckout(req("/api/checkout/stripe/create",payload),env,dependencies(fetcher))).status,400);
  }
  assert.equal((await handleCheckout(req("/api/checkout/stripe/create",cart,"","https://other.example"),env,dependencies(fetcher))).status,403);
  assert.equal((await handleCheckout(req("/api/checkout/stripe/create"),{...env,STRIPE_SECRET_KEY:"sk_live_fixture"},dependencies(fetcher))).status,503);
});
test("Completed but unpaid Stripe sessions do not produce paid receipts",async()=>{
  const cookie=await stripeCheckout();
  const fetcher=(async()=>reply({id:STRIPE_ID,livemode:false,currency:"nzd",amount_total:200,status:"complete",payment_status:"unpaid",metadata:{wpet_nonce:NONCE}})) as typeof fetch;
  const response=await handleCheckout(req("/api/checkout/stripe/confirm",{reference:STRIPE_ID},cookie),env,dependencies(fetcher));
  assert.equal(response.status,200); assert.equal((await response.json()).status,"pending");
});
test("Stripe receipt requires matching sandbox status, nonce, currency and amount",async()=>{
  const cookie=await stripeCheckout();
  const session={id:STRIPE_ID,livemode:false,currency:"nzd",amount_total:200,status:"complete",payment_status:"paid",metadata:{wpet_nonce:NONCE}};
  for(const change of [{livemode:true},{amount_total:1},{currency:"usd"},{metadata:{wpet_nonce:"other"}}]) {
    const response=await handleCheckout(req("/api/checkout/stripe/confirm",{reference:STRIPE_ID},cookie),env,dependencies((async()=>reply({...session,...change})) as typeof fetch));
    assert.equal(response.status,409);
  }
  const response=await handleCheckout(req("/api/checkout/stripe/confirm",{reference:STRIPE_ID},cookie),env,dependencies((async()=>reply(session)) as typeof fetch));
  assert.deepEqual(await response.json(),{provider:"stripe",status:"paid",testMode:true,reference:STRIPE_ID,amountMinor:200,currency:"NZD",items:cart.items});
});
test("Forged, expired and foreign checkout references are rejected before provider access",async()=>{
  const cookie=await stripeCheckout();
  const fetcher=(async()=>{throw new Error("Provider must not be called");}) as typeof fetch;
  for(const [reference,value,time] of [["cs_test_other",cookie,NOW],[STRIPE_ID,cookie+"tampered",NOW],[STRIPE_ID,cookie,NOW+3600001]] as const) {
    const response=await handleCheckout(req("/api/checkout/stripe/confirm",{reference},value),env,dependencies(fetcher,time));
    assert.equal(response.status,403);
  }
});

async function paypalCheckout() {
  const fetcher=(async(url,init)=>{
    assert.ok(String(url).startsWith("https://api-m.sandbox.paypal.com/"));
    if(String(url).endsWith("/oauth2/token")) return reply({access_token:"fixture-access-token"});
    const order=JSON.parse(String(init?.body));
    assert.equal(order.purchase_units[0].amount.value,"2.00");
    assert.equal(order.purchase_units[0].custom_id,NONCE);
    assert.equal(order.purchase_units[0].items[0].unit_amount.value,"1.00");
    assert.equal(order.payment_source.paypal.experience_context.shipping_preference,"NO_SHIPPING");
    assert.equal(order.payment_source.paypal.experience_context.return_url,ORIGIN+"/en/order-success/?provider=paypal");
    return reply({id:PAYPAL_ID,status:"PAYER_ACTION_REQUIRED",links:[{rel:"payer-action",href:`https://www.sandbox.paypal.com/checkoutnow?token=${PAYPAL_ID}`}]});
  }) as typeof fetch;
  const response=await handleCheckout(req("/api/checkout/paypal/create"),env,dependencies(fetcher));
  assert.equal(response.status,200);return cookieOf(response);
}
test("PayPal creation uses only sandbox endpoints and server-owned amounts",async()=>{await paypalCheckout();});
test("PayPal capture is approved-only and repeated confirmation avoids a second capture",async()=>{
  const cookie=await paypalCheckout();let captures=0;
  const completed={id:PAYPAL_ID,status:"COMPLETED",purchase_units:[{custom_id:NONCE,amount:{currency_code:"NZD",value:"2.00"},payments:{captures:[{status:"COMPLETED",amount:{currency_code:"NZD",value:"2.00"}}]}}]};
  const fetcher=(async(url,init)=>{
    if(String(url).endsWith("/oauth2/token")) return reply({access_token:"fixture-access-token"});
    if(String(url).endsWith("/capture")) {
      captures++;assert.equal(new Headers(init?.headers).get("PayPal-Request-Id"),`wpet-capture-${PAYPAL_ID}`);return reply(completed);
    }
    return reply(captures ? completed : {id:PAYPAL_ID,status:"APPROVED",purchase_units:[{custom_id:NONCE,amount:{currency_code:"NZD",value:"2.00"}}]});
  }) as typeof fetch;
  for(let i=0;i<2;i++) {
    const response=await handleCheckout(req("/api/checkout/paypal/confirm",{reference:PAYPAL_ID},cookie),env,dependencies(fetcher));
    assert.equal(response.status,200);assert.equal((await response.json()).status,"paid");
  }
  assert.equal(captures,1);
});
test("PayPal unapproved orders do not capture or display success",async()=>{
  const cookie=await paypalCheckout();
  const fetcher=(async(url)=>{
    if(String(url).endsWith("/oauth2/token")) return reply({access_token:"fixture-access-token"});
    assert.ok(!String(url).endsWith("/capture"));
    return reply({id:PAYPAL_ID,status:"PAYER_ACTION_REQUIRED",purchase_units:[{custom_id:NONCE,amount:{currency_code:"NZD",value:"2.00"}}]});
  }) as typeof fetch;
  const response=await handleCheckout(req("/api/checkout/paypal/confirm",{reference:PAYPAL_ID},cookie),env,dependencies(fetcher));
  assert.equal((await response.json()).status,"pending");
});
test("Provider failures and foreign redirect URLs fail closed without leaking provider messages",async()=>{
  const outage=await handleCheckout(req("/api/checkout/stripe/create"),env,dependencies((async()=>reply({error:{message:"private provider details"}},401)) as typeof fetch));
  assert.deepEqual(await outage.json(),{error:"payment_provider_unavailable"});
  const redirect=await handleCheckout(req("/api/checkout/stripe/create"),env,dependencies((async()=>reply({id:STRIPE_ID,livemode:false,url:"https://other.example/pay"})) as typeof fetch));
  assert.equal(redirect.status,502);assert.equal(redirect.headers.has("set-cookie"),false);
});
