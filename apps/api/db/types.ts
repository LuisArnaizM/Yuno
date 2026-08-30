import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  projectMembers,
  projects,
  tags,
  taskTags,
  tasks,
  users,
} from "@/db/schema";

export type UserRow = InferSelectModel<typeof users>;
export type NewUserRow = InferInsertModel<typeof users>;

export type ProjectRow = InferSelectModel<typeof projects>;
export type NewProjectRow = InferInsertModel<typeof projects>;

export type TagRow = InferSelectModel<typeof tags>;
export type NewTagRow = InferInsertModel<typeof tags>;

export type TaskRow = InferSelectModel<typeof tasks>;
export type NewTaskRow = InferInsertModel<typeof tasks>;

export type ProjectMemberRow = InferSelectModel<typeof projectMembers>;
export type NewProjectMemberRow = InferInsertModel<typeof projectMembers>;

export type TaskTagRow = InferSelectModel<typeof taskTags>;
export type NewTaskTagRow = InferInsertModel<typeof taskTags>;
