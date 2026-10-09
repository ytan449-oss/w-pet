# Fix native build verification on Vercel

The first real Vercel deployment compiled the Next.js app, then failed because the verifier assumed `.next/server/app/en/privacy.html` existed. The hosted build did not expose that pathname.

Check the native privacy route and both English/Chinese prerender entries in the build manifests instead of reading a fixed HTML path. Existing host-policy tests cover the correct Vercel disclosure; verify the actual served privacy content after a successful deployment. Native API, bilingual home/contact/checkout and sitemap checks remain required. Update the deployment guide with the confirmed account/project and authorized browser fallback.

Validation: the native Next.js build passes with the strengthened manifest checks, including both privacy routes. All 34 existing tests pass, including host-specific privacy disclosure. No approved brand or product copy changes. This change is stacked on PR #15 and remains unmerged for review. A successful local build does not imply a successful hosted redeployment.
