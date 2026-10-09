# Sandbox checkout

Complete the bilingual checkout with Stripe Checkout and PayPal sandbox redirects, server-calculated catalog amounts, provider readiness states and cancellation handling. Keep actual Next.js App Router; migrate hosting from static-only output to a single Worker embedding the Next export and payment API.

Payments remain test-only. Runtime provider credentials are not supplied; the preview accurately disables unconfigured methods. NZD 1.00/unit is a test amount, not approved retail pricing. The server rejects live Stripe keys, cross-origin writes, altered quantities and unowned checkout references, verifies provider amounts/status and uses idempotent PayPal capture.

See `docs/payments.md` for environment key names, local development and primary API references. No real fulfillment, shipping/tax calculation or public webhook is claimed. Provider response tests are mocked; actual sandbox account testing and browser visual QA remain pending.

One checkout-page commit. The verified return/receipt page follows in a separate PR.
