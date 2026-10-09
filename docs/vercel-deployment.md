# Vercel preview deployment

The repository retains Next.js App Router, TypeScript, Tailwind and all locally bundled images. `vercel.json` uses the native Next.js preset and `npm run build:vercel`; no Worker/static-export artifact is uploaded to Vercel. The build enables the compound `vercel.ts` page extension for `src/app/api/[...path]/route.vercel.ts`, includes the actual Node API and verifies the output manifest. Vercel's `VERCEL=1` also selects this profile when the platform inspects Next configuration outside the build command. The default `npm run build` keeps the existing Sites Worker export; that profile excludes the Node route through Next's page-extension matcher.

## Account and source

The owner's Vercel plugin is installed and enabled. Use that account's deployment tools to select or create the W Pet project when the tools are exposed to the execution. GitHub source is the private `ytan449-oss/w-pet` repository; select the latest review branch `feat/vercel-preview-adapter`, since earlier stacked PRs are intentionally unmerged. Do not import `main` and assume it contains every feature. Use Node 24, the native Next.js preset, `npm ci` and the committed Vercel build command. Do not configure the output directory as `out` or `dist`.

Deploy for review and preserve private access. Check deployment protection before sharing the URL; a new project's first deployment may be classed as production, even from a non-main branch. No custom production domain or PR merge is required. Return only the URL and ready status actually reported by Vercel, then verify it. Neither a local build nor the existing `chatgpt.site` URL proves a Vercel deployment.

## Environment variables

| Variable | Value and scope |
| --- | --- |
| `PAYMENT_MODE` | `test`; runtime |
| `CHECKOUT_SIGNING_SECRET` | New random secret with at least 32 characters; server only |
| `STRIPE_SECRET_KEY` | Owner's Stripe sandbox `sk_test_` key; server only |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Owner's PayPal sandbox app credentials; server only |
| `WPET_SITE_ORIGIN` | Optional trusted custom/branch origin. Leave unset for the exact Vercel deployment/branch URLs supplied by Vercel. Do not carry over a localhost or Sites origin. |
| `WPET_PUBLIC_SITE_URL` | Optional trusted canonical origin at build time. Leave unset to use `VERCEL_URL`. Never invent a domain. |
| `CLOUDFLARE_ACCOUNT_ID` | Owner's account ID; server only |
| `CLOUDFLARE_D1_DATABASE_ID` | Owner's D1 UUID; server only |
| `CLOUDFLARE_D1_API_TOKEN` | Scoped D1 write/read token; server only, never a client variable |

Enable Vercel's system environment variables so `VERCEL_URL` and `VERCEL_BRANCH_URL` are available. Runtime origin selection only accepts explicitly configured origins and those platform URLs. Native form rate limiting uses Vercel's overwritten visitor-IP headers, discarding visitor-supplied Sites identity and Cloudflare headers. Records contain an hourly hash, not the raw IP.

The contact database must be durable. Apply the committed `drizzle/` SQL migrations, in journal order, to the owner's target D1 database before enabling its configuration. The Sites-managed `DB` binding is not automatically available on Vercel; do not assume access to or copy managed credentials. Existing Sites enquiries remain in their original database. No fallback writes to memory or Vercel's temporary filesystem are used. Missing database credentials disable the native form; failed queries never display saved success. No automatic email is sent.

The privacy preview switches its hosting disclosure to Vercel/Cloudflare for a native build. Commercial operator and final policy information still await owner approval.

## Verification

Run `npm run typecheck`, `npm test`, `npm run build`, `npm run audit`, then `npm run build:vercel`. Worker and native builds are different artifacts. GitHub CI checks both. Native route tests use actual generated SQL through SQLite and mocked provider responses; remote D1 transport tests also use fixtures. They do not prove an actual Vercel account deployment, an external D1 write or a Stripe/PayPal sandbox payment.

After a real Vercel deployment, verify `/api/contact/config`, save a clearly marked synthetic enquiry, retry the same request ID and verify one hosted record. Verify `/api/checkout/config`, create and complete a Stripe test-card checkout and a PayPal sandbox-buyer checkout, follow cancellation/return links, and verify amount/currency/cookie binding and idempotent confirmation. Browser QA should check 320/375/390/768/1440px widths, menus, product options, cart quantities, language switching with queries/anchors, form validation and success screens.

Pages and Vercel headers remain `noindex` and `robots.txt` disallows crawling while this is a review preview. The bilingual sitemap is generated and served, but preview URLs are not advertised as searchable retail pages.

## Primary implementation references

- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/environment-variables/system-environment-variables
- https://vercel.com/docs/headers/request-headers
- https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions
- https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/

Current status: Vercel installation is confirmed, but this execution's callable tool registry exposes no Vercel account/deployment operations and no authorized CLI is available. Deployment has not been attempted through an unavailable operation. Merchant sandbox keys and the owner's external durable database credentials are not supplied in the existing runtime; the connected Vercel project's environment remains uninspected. Do not invent credentials or report an unperformed deployment/payment as successful.
