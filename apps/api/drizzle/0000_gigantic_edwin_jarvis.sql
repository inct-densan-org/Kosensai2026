CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_provider_account_unique` ON `account` (`provider_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `account_user_provider_idx` ON `account` (`user_id`,`provider_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_expires_at_idx` ON `session` (`expires_at`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`login_id` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'shop_staff' NOT NULL,
	`shop_id` text,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`display_username` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`shop_id`) REFERENCES `shops`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_role_check" CHECK("user"."role" in ('shop_staff', 'committee', 'admin'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_login_id_unique` ON `user` (`login_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_shop_id_idx` ON `user` (`shop_id`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE INDEX `verification_expires_at_idx` ON `verification` (`expires_at`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`storage_path` text NOT NULL,
	`public_url` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`duration_seconds` integer,
	`alt_text` text,
	`uploaded_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`uploaded_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `media_assets_kind_idx` ON `media_assets` (`kind`);--> statement-breakpoint
CREATE INDEX `media_assets_uploaded_by_idx` ON `media_assets` (`uploaded_by`);--> statement-breakpoint
CREATE TABLE `blog_article_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_article_id` integer NOT NULL,
	`media_asset_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`usage_type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`blog_article_id`) REFERENCES `blog_articles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `blog_article_media_article_sort_idx` ON `blog_article_media` (`blog_article_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `blog_article_media_asset_id_idx` ON `blog_article_media` (`media_asset_id`);--> statement-breakpoint
CREATE TABLE `blog_article_tags` (
	`blog_article_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`blog_article_id`, `tag_id`),
	FOREIGN KEY (`blog_article_id`) REFERENCES `blog_articles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `blog_article_tags_tag_id_idx` ON `blog_article_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `blog_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`body` text NOT NULL,
	`sanitized_body` text NOT NULL,
	`status` text NOT NULL,
	`article_type` text NOT NULL,
	`cover_media_id` integer,
	`author_user_id` text NOT NULL,
	`author_display_name` text,
	`published_at` integer,
	`scheduled_at` integer,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`cover_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `blog_articles_status_published_at_idx` ON `blog_articles` (`status`,"published_at" desc);--> statement-breakpoint
CREATE INDEX `blog_articles_article_type_published_at_idx` ON `blog_articles` (`article_type`,"published_at" desc);--> statement-breakpoint
CREATE INDEX `blog_articles_author_user_id_idx` ON `blog_articles` (`author_user_id`);--> statement-breakpoint
CREATE INDEX `blog_articles_cover_media_id_idx` ON `blog_articles` (`cover_media_id`);--> statement-breakpoint
CREATE TABLE `news_article_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`news_article_id` integer NOT NULL,
	`media_asset_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`usage_type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`news_article_id`) REFERENCES `news_articles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `news_article_media_article_sort_idx` ON `news_article_media` (`news_article_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `news_article_media_asset_id_idx` ON `news_article_media` (`media_asset_id`);--> statement-breakpoint
CREATE TABLE `news_article_tags` (
	`news_article_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`news_article_id`, `tag_id`),
	FOREIGN KEY (`news_article_id`) REFERENCES `news_articles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `news_article_tags_tag_id_idx` ON `news_article_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`body` text NOT NULL,
	`sanitized_body` text NOT NULL,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	`published_at` integer,
	`scheduled_at` integer,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `news_articles_status_published_at_idx` ON `news_articles` (`status`,"published_at" desc);--> statement-breakpoint
CREATE INDEX `news_articles_priority_published_at_idx` ON `news_articles` (`priority`,"published_at" desc);--> statement-breakpoint
CREATE INDEX `news_articles_created_by_idx` ON `news_articles` (`created_by`);--> statement-breakpoint
CREATE INDEX `news_articles_updated_by_idx` ON `news_articles` (`updated_by`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `shop_menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`shop_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shop_menu_items_code_unique` ON `shop_menu_items` (`code`);--> statement-breakpoint
CREATE INDEX `shop_menu_items_shop_sort_order_idx` ON `shop_menu_items` (`shop_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `shops` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`poster_media_id` integer,
	`sns_url` text,
	`status` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`poster_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shops_code_unique` ON `shops` (`code`);--> statement-breakpoint
CREATE INDEX `shops_status_sort_order_idx` ON `shops` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `shops_poster_media_id_idx` ON `shops` (`poster_media_id`);--> statement-breakpoint
CREATE TABLE `map_layers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`image_url` text NOT NULL,
	`width` integer,
	`height` integer,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `map_layers_code_unique` ON `map_layers` (`code`);--> statement-breakpoint
CREATE INDEX `map_layers_sort_order_idx` ON `map_layers` (`sort_order`);--> statement-breakpoint
CREATE TABLE `map_pin_timetable_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`departure_at` text NOT NULL,
	`label` text NOT NULL,
	`note` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `map_pin_timetable_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `map_pin_timetable_entries_group_sort_order_idx` ON `map_pin_timetable_entries` (`group_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `map_pin_timetable_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`map_pin_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`map_pin_id`) REFERENCES `map_pins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `map_pin_timetable_groups_pin_sort_order_idx` ON `map_pin_timetable_groups` (`map_pin_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `map_pins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`map_layer_id` integer NOT NULL,
	`pin_type` text NOT NULL,
	`shop_id` text,
	`title` text NOT NULL,
	`label` text,
	`description` text,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`color` text,
	`is_interactive` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`map_layer_id`) REFERENCES `map_layers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shop_id`) REFERENCES `shops`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `map_pins_code_unique` ON `map_pins` (`code`);--> statement-breakpoint
CREATE INDEX `map_pins_shop_id_idx` ON `map_pins` (`shop_id`);--> statement-breakpoint
CREATE TABLE `event_status_overrides` (
	`event_id` integer PRIMARY KEY NOT NULL,
	`change_type` text NOT NULL,
	`override_status` text NOT NULL,
	`override_start_at` integer,
	`override_end_at` integer,
	`override_venue_id` integer,
	`message` text,
	`updated_by` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`override_venue_id`) REFERENCES `event_venues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `event_status_overrides_override_venue_id_idx` ON `event_status_overrides` (`override_venue_id`);--> statement-breakpoint
CREATE INDEX `event_status_overrides_updated_by_idx` ON `event_status_overrides` (`updated_by`);--> statement-breakpoint
CREATE TABLE `event_venues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`map_layer_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`map_layer_id`) REFERENCES `map_layers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_venues_code_unique` ON `event_venues` (`code`);--> statement-breakpoint
CREATE INDEX `event_venues_map_layer_id_idx` ON `event_venues` (`map_layer_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`venue_id` integer NOT NULL,
	`event_date` text NOT NULL,
	`start_at` integer NOT NULL,
	`end_at` integer NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`rainy_venue_text` text,
	`restriction_text` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`venue_id`) REFERENCES `event_venues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_code_unique` ON `events` (`code`);--> statement-breakpoint
CREATE INDEX `events_event_date_venue_start_idx` ON `events` (`event_date`,`venue_id`,`start_at`);--> statement-breakpoint
CREATE INDEX `events_status_event_date_start_idx` ON `events` (`status`,`event_date`,`start_at`);--> statement-breakpoint
CREATE TABLE `reaction_summaries` (
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`reaction_type` text NOT NULL,
	`count` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`target_type`, `target_id`, `reaction_type`)
);
--> statement-breakpoint
CREATE INDEX `reaction_summaries_updated_at_idx` ON `reaction_summaries` (`updated_at`);--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`fingerprint` text NOT NULL,
	`reaction_type` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reactions_target_fingerprint_unique` ON `reactions` (`target_type`,`target_id`,`fingerprint`,`reaction_type`);--> statement-breakpoint
CREATE INDEX `reactions_target_idx` ON `reactions` (`target_type`,`target_id`);