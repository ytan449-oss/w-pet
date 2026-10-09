# Contact page and persisted enquiries

Complete the English/Chinese contact page with a mobile-first, accessible form for general, custom-colour, product-care, sandbox-checkout and privacy questions. Show a reference only after the server confirms the inquiry was stored. No outbound email or reply deadline is claimed.

Add a Sites-managed D1 binding and generated, schema-only Drizzle migrations. Server validation checks origin, bounded UTF-8 input, consent, topic and locale; parameterized SQL stores the message and the privacy-notice version. Stable request IDs prevent retry duplicates. Short-lived HMAC rate keys replace raw IP storage; no inquiry list is exposed publicly and provider failures never return a false success.

SQLite integration tests execute the actual generated schema and verify persistence, retries, altered payloads, validation, rate limits and failed storage. The existing Stripe/PayPal sandbox flow is preserved. The form uses no new merchant credentials or email recipient.

One contact-page commit, stacked on the prior payment-result PR. Privacy and terms follow as separate pages/PRs. Owner-private access is preserved. Browser visual QA is unavailable in this environment.
