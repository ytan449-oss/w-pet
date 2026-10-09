# W Pet storefront

An English-first, Chinese-secondary storefront for W Pet, an original New Zealand pet brand. Mobile-first brand-blue/cream layouts use the owner's approved brand copy verbatim. This is an owner-private test preview, not a live retail launch.

## Stack and local development

- Actual Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4.
- Node.js 24 recommended. `npm ci` installs the locked dependencies.
- Copy `.env.example` to ignored `.env.local`; configure the local signing key and any merchant sandbox values there.
- `npm run dev:api` starts the contact/payment API with the local SQLite database; run `npm run dev` in a separate terminal. Next.js proxies `/api` to that API.
- `npm run db:local` applies committed migrations to ignored `.sites-runtime/contact.sqlite`. Local data is separate from hosted D1.
- `npm run typecheck`, `npm test`, `npm run build` run in GitHub CI.

Production builds export Next.js to `out/`, then embed those assets and the server payment/contact handlers in `dist/server/index.js`, a Worker ESM entrypoint. Worker artifact smoke checks exercise every HTML route, RSC navigation, image delivery and API routing. Serving `out/` alone does not provide the contact/payment APIs; `next start` is not used with static export.

## Implemented routes

English is the entry language at `/`. Every storefront page has `/en/` and `/zh/` versions:

| Page | Route after locale |
| --- | --- |
| Homepage | `/` |
| Aotearoa Bloom Collection | `/collections/aotearoa-bloom/` |
| Leash details | `/products/aotearoa-bloom-hand-woven-dog-leash/` |
| About | `/our-story/` |
| Our Craft | `/craftsmanship/` |
| Care & FAQ | `/care-faq/` |
| Contact / saved enquiries | `/contact/` |
| Test cart | `/cart/` |
| Sandbox checkout | `/checkout/` |
| Verified payment result | `/order-success/` |
| Preview privacy policy | `/privacy/` |
| Preview terms | `/terms/` |

No requested storefront page remains a full-page placeholder. Unknown routes render a localized 404. Language switching preserves route/query/hash and cart selections; mobile navigation supports keyboard use and Escape. Pages remain `noindex` while the Site is private and commercial details await approval.

## Catalog and brand content

`src/config/products.ts` contains the Aotearoa Bloom Hand-Woven Dog Leash and its four standard/lightweight × 1.2m/2m variants. Pink Mint Haze is the supplied colour; small-batch custom-colour enquiries use the contact form. Specifications match the owner's data. The catalog adapter can later be replaced by a CMS without restructuring components; CMS-fed export routes require rebuilding.

`src/config/brand.ts` retains the approved story, slogan, positioning and personality. Product FAQ answers reuse the catalog's existing values. Official washing/storage instructions are awaiting the owner's source; the page links to product-care enquiries instead of fabricating them.

## Saved enquiries and sandbox payments

Contact messages are saved to Sites-managed D1 and receive a reference only after storage succeeds. The form does not send email. `db/schema.ts` plus committed `drizzle/` migrations own the schema; `npm run db:generate` generates changes. Applied migrations are immutable. See [contact storage](docs/contact-storage.md) for fields, owner access and local setup.

Stripe Checkout and PayPal are sandbox-only. The server calculates catalog test amounts, binds sessions to signed cookies and verifies provider references, nonces, amounts/currency and completed status. PayPal capture is idempotent. Missing merchant sandbox credentials disable the corresponding methods. See [payment setup](docs/payments.md).

There is no physical fulfilment, stock reservation, commercial invoice, shipping/tax calculation, order database or public fulfilment webhook. Verified payment receipts are test records. NZD 1.00/unit is only a test amount; the retail price is unknown.

## Review status and remaining inputs

Each page has a separate completion commit and review PR; keep the stacked PRs unmerged until owner review. GitHub Actions checks TypeScript, tests and production build on each PR. The private GitHub repository and the Site source repository contain matching source trees, with separate commit histories.

Still needed: merchant sandbox credentials and real provider end-to-end testing; retail price/stock; real product photography and tensile-test report; official care instructions; legal operator/address/privacy contact and approved retention, sales, shipping, taxes/duties and returns arrangements. Policy pages are explicit preview drafts based on actual implemented behavior, with [primary-source notes](docs/policy-sources.md).

Browser visual QA is unavailable in the current managed environment because the supported browser-control skill is absent. TypeScript, integration tests, builds and static/Worker checks do not replace that visual verification.

## Visual assets

The lifestyle photograph and three leash views are generated concepts, not verified product photography. Concept labels remain visible. Prompts, source paths and provenance are recorded in [visual assets](docs/visual-assets.md); earlier bandana SVG concepts remain provenance assets, not current catalog entries.
