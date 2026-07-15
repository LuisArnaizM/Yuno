import { Elysia, t } from "elysia";
import { resolveCurrentUser } from "@/lib/auth";
import { createProject, listProjects } from "@/controllers/project.controller";

const authHeaderSchema = t.Object({
  authorization: t.Optional(t.String()),
});

const createProjectBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 120 }),
  description: t.Optional(t.String({ maxLength: 500 })),
});

export const projectRoutes = new Elysia({ prefix: "/projects" })
  .get(
    "/",
    async ({ headers, set }) => {
      const currentUser = await resolveCurrentUser(headers.authorization);

      if (!currentUser) {
        set.status = 401;
        return { message: "No autorizado" };
      }

      return listProjects(currentUser.id);
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Projects"] },
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

      const result = await createProject(currentUser.id, body);

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      headers: authHeaderSchema,
      body: createProjectBodySchema,
      detail: { tags: ["Projects"] },
    },
  );
