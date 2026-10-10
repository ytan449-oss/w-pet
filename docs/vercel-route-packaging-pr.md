# Fix native Vercel API packaging

The second real Vercel deployment passed Next.js compilation and route verification but failed while uploading outputs: Vercel requested `app/api/[...path]/route_client-reference-manifest.js`. The compound `route.vercel.ts` filename was treated as a page by output packaging.

Native hosting now uses conventional `route.ts` and default Next.js extensions. Worker exports match `.tsx` only; the robots and sitemap metadata retain the same endpoints with `.tsx` source filenames. API handlers, approved content and checkout behavior are unchanged. Native verification rejects compound extensions and still checks the actual API, bilingual privacy routes and sitemap manifests.

Validation: both build profiles pass, including TypeScript and native route checks. All 34 tests pass. The export audit verifies 24 bilingual pages, 18 sitemap entries and zero external assets. Real hosted verification remains required. This PR is stacked on #16 and is not merged automatically.
