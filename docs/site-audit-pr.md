# Full storefront audit

Add distinct English/Chinese descriptions and matching Open Graph descriptions to every storefront page, with canonical and reciprocal language links. Brand excerpts remain unchanged. Generate a bilingual sitemap with 18 URLs, excluding cart, checkout, order-result and duplicate root entry. Keep this unapproved retail preview `noindex`; robots now points to the sitemap. Metadata origins support a trusted configured URL or Vercel's deployment URL.

Fix the missing global-404 title/description and provide English/Chinese return links. Improve narrow screens with wrapping headings/product rows, bounded mobile navigation, zero-minimum product/cart grid columns, 44px footer targets and 16px contact/quantity inputs. Product version, length and colour choices are reflected in the URL so switching language retains those selections.

Validation: 26 tests pass; the production Next export and Worker smoke checks pass. The exported-site audit verifies 24 localized pages, unique titles/descriptions, viewport/HTML language, canonical/alternate links, 787 internal link/stylesheet references, 325 local asset references and all 18 sitemap URLs. No external image, stylesheet or SVG asset reference was found. Approved brand and product config files are unchanged.

Browser layout/interaction QA remains unperformed. The current managed environment has no supported browser-control skill; Sites requires skipping browser QA rather than starting a server or another browser path. Static checks do not prove layouts at 320/375/390/768/1440px or hydrated interaction.

Merchant Stripe/PayPal credentials are still absent. Existing provider tests are mocked and must not be described as real sandbox transactions. Vercel deployment requires the owner's installed/connected Vercel plugin and an external durable contact-database configuration; preparation is a separate stacked PR.
