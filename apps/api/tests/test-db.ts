import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  projectMembers,
  projects,
  tags,
  taskTags,
  tasks,
  users,
} from "@/db/schema";

export async function resetDatabase() {
  await db.delete(taskTags);
  await db.delete(tasks);
  await db.delete(projectMembers);
  await db.delete(tags);
  await db.delete(projects);
  await db.delete(users);
  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name IN ('users', 'projects', 'tags', 'tasks')`,
  );
}
