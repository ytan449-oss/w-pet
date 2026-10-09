# W Pet storefront verification

Audit date: 2026-10-10, Pacific/Auckland. Audit changes are reviewed in PR #14; the native Vercel adapter is a separate stacked review change. Approved brand copy and product specifications are unchanged.

## Completed checks

- All 12 page types have English and Chinese routes, independent titles/descriptions, canonical URLs and language alternates. The export audit inspected 29 HTML files, including 24 localized pages and generated error aliases.
- The sitemap contains 18 bilingual content URLs with reciprocal language alternates. Cart, checkout and order-success pages are omitted. Review builds remain `noindex`; robots disallows indexing.
- 787 internal link/stylesheet references and 325 local asset references were verified. No external image, script or stylesheet asset references were found.
- Mobile CSS fixes include long-text wrapping, bounded menu scrolling, shrinkable product/cart grids, wrapping product headings, 44px footer targets and 16px form fields. Existing responsive breakpoints are retained.
- Product selections persist in the URL when switching languages; reciprocal locale links preserve query parameters and anchors. These behaviors have automated code/export coverage; hydrated browser interactions remain unchecked.
- 34 tests pass. Native API tests cover actual SQLite persistence and duplicate-request handling, trusted write/return origins, provider amount/currency verification, signed-cookie binding and idempotent PayPal capture. Provider responses and remote D1 transport are fixtures.
- TypeScript, the default Sites Worker build, the export audit and the native Next.js Vercel build pass. The native manifest contains the actual `/api/[...path]` Node handler, bilingual content and sitemap. Both build profiles are included in CI.

## Existing hosted form verification

The existing private preview's `/api/contact/config` reported available. A clearly marked synthetic Chinese enquiry using an `example.invalid` email was submitted with client request ID `88db3817-c1d1-40fd-9362-0671bfb659df`.

The API returned HTTP 201, `saved: true` and reference `WP-a09146c0-2027-4770-9fb6-7727f88caaba`. Repeating the same request returned HTTP 200 and the same reference. A read of the hosted `contact_inquiries` table confirmed exactly one matching record. No email was sent. This proves the existing Sites database flow; it does not prove storage on Vercel.

The existing hosted checkout configuration reports test mode with Stripe and PayPal disabled. Merchant sandbox credentials are absent in that runtime. Real provider checkout/capture has not been performed.

## Outstanding checks

- Browser viewport and visual QA at 320/375/390/768/1440px, hydrated menus/cart/language controls and full browser checkout flows. The supported browser-control skill is unavailable in this managed container, so no substitute browser/server was started.
- Vercel account/project inspection and actual deployment. Plugin discovery confirms Vercel is installed and enabled; its account/deployment tools are not exposed in this execution's registry, and no authorized CLI is available.
- Durable form storage on Vercel requires the owner's target Cloudflare D1 configuration and migrations. Existing Sites-managed database credentials are not copied to Vercel.
- Actual Stripe test-card and PayPal sandbox-buyer transactions require owner merchant credentials. The current test amount is NZD 1 per unit, not a retail price.

No unperformed browser test, Vercel deployment, external database write or merchant sandbox transaction is reported as successful.
