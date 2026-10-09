# W Pet storefront

An English-first, bilingual storefront foundation for W Pet, an original New Zealand pet brand.

## Stack and local development

- Next.js 16 App Router, React 19, TypeScript with strict checking, Tailwind CSS 4.
- Node.js 24 recommended; Node.js 22 minimum.
- `npm ci`, then `npm run dev`.
- `npm run typecheck`, `npm test`, `npm run build`.
- Static preview output is generated in `out/`. `next start` is not compatible with static export; use `npm run dev` for development or serve `out/` with a static host.

## First review: foundation and homepage

This iteration implements the shared layout, all requested routes and the homepage. Other pages deliberately remain branded placeholders for subsequent page-by-page review. The collection and three sample bandanas are **concept data**, with indicative NZD prices. They are not live inventory.

Checkout, payments, order creation, customer accounts and contact submissions are not active. The order-success placeholder never claims that an order was placed. Production policies, shipping, materials, sizing and stock must be supplied before launch. Preview pages are marked `noindex` and the robots file blocks crawling.

## Routes

English is the default at `/`. Every storefront route has `/en/` and `/zh/` versions:

| Page | Route after locale |
| --- | --- |
| Homepage | `/` |
| Aotearoa Bloom Collection | `/collections/aotearoa-bloom/` |
| Product details | `/products/[slug]/` |
| Brand story | `/our-story/` |
| Craftsmanship | `/craftsmanship/` |
| Care and FAQ | `/care-faq/` |
| Contact | `/contact/` |
| Cart | `/cart/` |
| Checkout | `/checkout/` |
| Order success | `/order-success/` |
| Privacy policy | `/privacy/` |
| Terms | `/terms/` |

The language switch keeps the current route, query and hash. Separate root layouts render the correct HTML `lang` attribute for each locale. Mobile navigation supports keyboard operation and Escape to close.

## Content and future CMS

`src/config/products.ts` contains localized collection and product data. Prices use integer minor units. Components read the `CatalogRepository` interface in `src/types/catalog.ts` through `src/lib/catalog.ts`; replace this adapter with CMS queries without restructuring the UI. CMS-fed static routes will require a rebuild, or migration away from `output: "export"` to a server deployment.

All UI copy lives in `src/lib/i18n.ts`, with English and Chinese dictionaries checked against the same TypeScript shape. The origin, currency and commerce flag live in `src/config/site.ts`.

## Review workflow

Keep `main` as the reviewed baseline. Use a feature branch per page, one page-completion commit and one PR. Start with `feat/foundation-and-homepage`; next is the collection page, followed by product details, story, craftsmanship, care/FAQ, contact, cart, checkout, success and policies. Do not merge review PRs automatically.

GitHub Actions checks TypeScript, tests and the production build on each PR. A private GitHub repository and its PR require a connected GitHub account with repository creation/write access; local commits are not proof of a remote PR.

## Visual assets

The homepage photograph is AI-generated concept imagery, not a photograph of a final product. The three product illustrations are original SVG design concepts. Source prompts and provenance are recorded in `docs/visual-assets.md`.
