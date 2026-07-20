import { Elysia, t } from "elysia";
import { authService } from "@/lib/auth";
import {
  createTask,
  listAssignedTasks,
  listTasks,
  updateTask,
} from "@/controllers/task.controller";

const authHeaderSchema = t.Object({
  authorization: t.Optional(t.String()),
});

const createTaskBodySchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 120 }),
  description: t.Optional(t.String({ maxLength: 500 })),
  projectId: t.Optional(t.Nullable(t.Number({ minimum: 1 }))),
  assigneeId: t.Optional(t.Nullable(t.Number({ minimum: 1 }))),
  status: t.Optional(
    t.Union([
      t.Literal("todo"),
      t.Literal("in_progress"),
      t.Literal("blocked"),
      t.Literal("done"),
    ]),
  ),
  tagIds: t.Optional(t.Array(t.Number({ minimum: 1 }))),
});

const updateTaskBodySchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 120 })),
  description: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
  projectId: t.Optional(t.Nullable(t.Number({ minimum: 1 }))),
  assigneeId: t.Optional(t.Nullable(t.Number({ minimum: 1 }))),
  status: t.Optional(
    t.Union([
      t.Literal("todo"),
      t.Literal("in_progress"),
      t.Literal("blocked"),
      t.Literal("done"),
    ]),
  ),
  tagIds: t.Optional(t.Array(t.Number({ minimum: 1 }))),
});

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .get(
    "/",
    async ({ headers, set }) => {
      const authResult = await authService.authenticate(headers.authorization);

      if (!authResult.ok) {
        set.status = authResult.status;
        return authResult.body;
      }

      return listTasks(authResult.user.id);
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Tasks"] },
    },
  )
  .get(
    "/me",
    async ({ headers, set }) => {
      const authResult = await authService.authenticate(headers.authorization);

      if (!authResult.ok) {
        set.status = authResult.status;
        return authResult.body;
      }

      return listAssignedTasks(authResult.user.id);
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Tasks"] },
    },
  )
  .patch(
    "/:taskId",
    async ({ params, body, headers, set }) => {
      const authResult = await authService.authenticate(headers.authorization);

      if (!authResult.ok) {
        set.status = authResult.status;
        return authResult.body;
      }

      const result = await updateTask(
        authResult.user.id,
        Number(params.taskId),
        body,
      );

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      headers: authHeaderSchema,
      params: t.Object({ taskId: t.String() }),
      body: updateTaskBodySchema,
      detail: { tags: ["Tasks"] },
    },
  )
  .post(
    "/",
    async ({ body, headers, set }) => {
      const authResult = await authService.authenticate(headers.authorization);

      if (!authResult.ok) {
        set.status = authResult.status;
        return authResult.body;
      }

      const result = await createTask(authResult.user.id, body);

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
