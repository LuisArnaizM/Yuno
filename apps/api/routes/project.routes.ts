import { Elysia, t } from "elysia";
import { authService } from "@/lib/auth";
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
      const authResult = await authService.authenticate(headers.authorization);

      if (!authResult.ok) {
        set.status = authResult.status;
        return authResult.body;
      }

      return listProjects(authResult.user.id);
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Projects"] },
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

      const result = await createProject(authResult.user.id, body);

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
