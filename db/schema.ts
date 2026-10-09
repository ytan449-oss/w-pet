import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactInquiries = sqliteTable("contact_inquiries", {
  id: text("id").primaryKey(),
  clientRequestId: text("client_request_id").notNull().unique(),
  payloadHash: text("payload_hash").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  locale: text("locale").notNull(),
  noticeVersion: text("notice_version").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [index("contact_created_at_idx").on(table.createdAt)]);

export const contactRateLimits = sqliteTable("contact_rate_limits", {
  id: text("id").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, table => [index("contact_rate_expiry_idx").on(table.expiresAt)]);
