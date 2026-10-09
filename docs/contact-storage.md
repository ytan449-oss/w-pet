# Contact inquiry storage

The contact form saves inquiries to the Site's D1 `DB` binding. It does not send email. The owner can read `contact_inquiries` through the Sites database overview/table tools; there is no public list endpoint. Verify a submit by its returned `WP-…` reference rather than assuming an email was sent.

`db/schema.ts` owns the schema. Run `npm run db:generate` after schema edits and inspect the SQL before committing. Source packaging includes `drizzle/` in the deployment archive; Sites applies hosted migrations before uploading the Worker. Applied migrations must remain unchanged.

For development, `npm run db:local` creates an ignored `.sites-runtime/contact.sqlite`. `npm run dev:api` applies the same migrations and opens this local database. Fill `.env.local` from `.env.example`; the existing `CHECKOUT_SIGNING_SECRET` signs namespaced request/rate hashes. Then run `npm run dev` in a separate terminal. Local and hosted databases are separate.

Fields saved: name, email, topic, message, locale, request ID, a payload hash, collection-notice version and creation time. Required fields are disclosed before collection. Payment details and raw visitor IPs are not stored in inquiry records. Rate keys use an hourly namespace and old buckets are removed during the next valid submission. No advertising, automatic newsletter, CRM export or outbound email is added.

Inquiry records have no automatic retention/deletion job. The owner must handle access, correction/deletion requests and review/remove records that are no longer needed. Do not advertise a fixed retention deadline without implementing and approving that process. Public launch also needs the legal operator, postal/privacy contact details and the final retention process confirmed.
