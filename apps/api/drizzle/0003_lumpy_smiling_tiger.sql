PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`owner_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "projects_name_len" CHECK(length("name") between 1 and 120),
	CONSTRAINT "projects_description_len" CHECK(length("description") <= 500)
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "description", "owner_id", "created_at", "updated_at") SELECT "id", "name", "description", "owner_id", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "tags_name_len" CHECK(length("name") between 1 and 80),
	CONSTRAINT "tags_color_len" CHECK(length("color") = 7)
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "color", "created_at", "updated_at") SELECT "id", "name", "color", "created_at", "updated_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`project_id` integer,
	`assignee_id` integer,
	`status` text DEFAULT 'todo' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "tasks_title_len" CHECK(length("title") between 1 and 120),
	CONSTRAINT "tasks_description_len" CHECK(length("description") <= 500)
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "description", "project_id", "assignee_id", "status", "created_at", "updated_at") SELECT "id", "title", "description", "project_id", "assignee_id", "status", "created_at", "updated_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "users_name_len" CHECK(length("name") between 1 and 120),
	CONSTRAINT "users_email_len" CHECK(length("email") <= 255),
	CONSTRAINT "users_password_hash_len" CHECK(length("password_hash") <= 255)
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password_hash", "created_at", "updated_at") SELECT "id", "name", "email", "password_hash", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);