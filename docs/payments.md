# Sandbox payment setup

The storefront remains actual Next.js App Router + TypeScript + Tailwind. Production Next.js static exports and the TypeScript payment API are bundled into one Cloudflare Worker. This preserves the Site identity and owner-private audience. No provider secret is included in Next.js client bundles.

## Runtime values

Configure these in Site environment settings, with secrets marked as secret:

- `PAYMENT_MODE=test` (the only supported mode)
- `WPET_SITE_ORIGIN=https://w-pet-aotearoa-bloom.redcrumb3.chatgpt.site`
- `CHECKOUT_SIGNING_SECRET` (random value with at least 32 characters)
- `STRIPE_SECRET_KEY` (Stripe sandbox key beginning `sk_test_`)
- `PAYPAL_CLIENT_ID` (sandbox app client ID)
- `PAYPAL_CLIENT_SECRET` (sandbox app secret)

Missing credentials leave the corresponding checkout method unavailable. Live Stripe keys are rejected and PayPal's API origin is fixed to `https://api-m.sandbox.paypal.com`. The NZD 1.00/unit test amount is server-owned catalog configuration; it is not a selling price. Taxes, shipping charges, inventory, real fulfillment and durable order storage are not configured. This is a sandbox integration, not a production commerce launch.

## Local development

Copy `.env.example` to the ignored `.env.local` and fill in sandbox values. Run `npm run dev:api` and `npm run dev` in separate terminals. The Next development server proxies `/api` to the local API. Production `npm run build` creates `dist/server/index.js` with all Next export assets embedded. `npm run typecheck`, `npm test` and the production build run in CI.

## Verification and ownership

Client requests contain only variant IDs, quantities and locale. The server validates the catalog, recalculates amounts and creates the Stripe Checkout Session or PayPal order. Signed, HttpOnly, SameSite cookies bind each provider's checkout reference to the browser, cart and expiry. Confirmation verifies reference, nonce, amount, currency and provider status. PayPal capture uses a stable idempotency key and requires an approved order. Repeated completed-order confirmation reads the receipt without another capture.

Stripe success is shown only for `status=complete` and `payment_status=paid` with `livemode=false`. PayPal success requires a completed order and completed captures with the correct NZD amount. URL parameters do not prove payment. One active checkout per provider is supported per browser. Cookies expire after one hour; Stripe sessions use the same expiry.

This private preview does not install public webhooks. Provider confirmation happens on return; unattended fulfillment and reconciliation require a later production order store and authenticated webhook design.

## Primary references

- https://docs.stripe.com/api/checkout/sessions/create
- https://docs.stripe.com/api/checkout/sessions/retrieve
- https://developer.paypal.com/api/rest/authentication
- https://developer.paypal.com/api/orders/v2/orders-create
- https://developer.paypal.com/api/orders/v2/orders-capture

Real provider end-to-end sandbox verification requires the owner's sandbox credentials. Unit tests use mocked provider responses; they do not prove account activation or an actual sandbox transaction.
