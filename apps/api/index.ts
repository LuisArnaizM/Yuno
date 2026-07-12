import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { desc } from "drizzle-orm";
import type { User } from "@yuno/shared-types";
import { createTaskDtoSchema, taskDtoSchema } from "@yuno/shared-types";
import { db } from "./db/client";
import { tasks } from "./db/schema";

const users: User[] = [{ id: 1, nombre: "Luis" }];

const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Yuno API",
          version: "0.1.0",
          description: "API de ejemplo con Elysia + Drizzle + SQLite",
        },
        tags: [{ name: "Tasks" }, { name: "Users" }],
      },
    }),
  )
  .get("/", () => "API viva")
  .get("/users", () => users, { detail: { tags: ["Users"] } })
  .get(
    "/tasks",
    async () => {
      const rows = await db.select().from(tasks).orderBy(desc(tasks.id));
      return rows.map((row) => taskDtoSchema.parse(row));
    },
    { detail: { tags: ["Tasks"] } },
  )
  .post(
    "/tasks",
    async ({ body, set }) => {
      const parsedBody = createTaskDtoSchema.safeParse(body);

      if (!parsedBody.success) {
        set.status = 400;
        return {
          message: "Payload invalido",
          issues: parsedBody.error.flatten(),
        };
      }

      const now = new Date().toISOString();
      const [inserted] = await db
        .insert(tasks)
        .values({
          title: parsedBody.data.title,
          description: parsedBody.data.description ?? null,
          status: "todo",
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return taskDtoSchema.parse(inserted);
    },
    { detail: { tags: ["Tasks"] } },
  )
  .listen(3001);

console.log(`API corriendo en http://localhost:${app.server?.port}`);
