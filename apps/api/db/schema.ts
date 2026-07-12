import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { TaskStatus } from "@yuno/shared-types";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["todo", "in_progress", "done"] })
    .$type<TaskStatus>()
    .notNull()
    .default("todo"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
