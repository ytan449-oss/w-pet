# Verified sandbox payment result

Replace the bilingual order-success placeholder with provider-confirmed sandbox states and a receipt. A return URL alone never shows success: the page calls the server's ownership-bound confirmation endpoint and requires the matching provider/reference, currency, catalog amount and test mode. Pending, expired, missing-reference and verification-error states retain the cart and give an appropriate next action.

Confirmed payment shows the selected variants, quantities, sandbox total and transaction reference, explicitly without a retail order or shipment. Purchased quantities are removed once per browser tab/session, preserving unrelated selections and extra items added after checkout. A storage failure leaves the verified payment result visible and explains how to update the cart manually.

Validation includes payment-response and cart-cleanup tests, type checking, Next.js production export and Worker artifact smoke checks. Real Stripe/PayPal sandbox end-to-end testing requires merchant credentials; browser visual QA remains pending. One result-page commit, stacked on the checkout PR.
