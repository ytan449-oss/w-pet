CREATE TABLE `contact_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`client_request_id` text NOT NULL,
	`payload_hash` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`topic` text NOT NULL,
	`message` text NOT NULL,
	`locale` text NOT NULL,
	`notice_version` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_inquiries_client_request_id_unique` ON `contact_inquiries` (`client_request_id`);--> statement-breakpoint
CREATE INDEX `contact_created_at_idx` ON `contact_inquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `contact_rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_rate_expiry_idx` ON `contact_rate_limits` (`expires_at`);