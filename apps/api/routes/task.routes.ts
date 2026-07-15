import { Elysia, t } from "elysia";
import { resolveCurrentUser } from "@/lib/auth";
import {
  createTask,
  listAssignedTasks,
  listTasks,
} from "@/controllers/task.controller";

const authHeaderSchema = t.Object({
  authorization: t.Optional(t.String()),
});

const createTaskBodySchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 120 }),
  description: t.Optional(t.String({ maxLength: 500 })),
  projectId: t.Optional(t.Nullable(t.Number({ minimum: 1 }))),
  assigneeId: t.Optional(t.Nullable(t.Number({ minimum: 1 }))),
  tagIds: t.Optional(t.Array(t.Number({ minimum: 1 }))),
});

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .get(
    "/",
    async ({ headers, set }) => {
      const currentUser = await resolveCurrentUser(headers.authorization);

      if (!currentUser) {
        set.status = 401;
        return { message: "No autorizado" };
      }

      return listTasks(currentUser.id);
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Tasks"] },
    },
  )
  .get(
    "/me",
    async ({ headers, set }) => {
      const currentUser = await resolveCurrentUser(headers.authorization);

      if (!currentUser) {
        set.status = 401;
        return { message: "No autorizado" };
      }

      return listAssignedTasks(currentUser.id);
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Tasks"] },
    },
  )
  .post(
    "/",
    async ({ body, headers, set }) => {
      const currentUser = await resolveCurrentUser(headers.authorization);

      if (!currentUser) {
        set.status = 401;
        return { message: "No autorizado" };
      }

      const result = await createTask(currentUser.id, body);

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      headers: authHeaderSchema,
      body: createTaskBodySchema,
      detail: { tags: ["Tasks"] },
    },
  );
