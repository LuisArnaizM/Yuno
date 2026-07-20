import { Elysia, t } from "elysia";
import { authService } from "@/lib/auth";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "@/controllers/auth.controller";

const authHeaderSchema = t.Object({
  authorization: t.Optional(t.String()),
});

const registerBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 120 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 4 }),
});

const loginBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 120 }),
  password: t.String({ minLength: 1 }),
});

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({ body, set }) => {
      const result = await registerUser(body);

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      body: registerBodySchema,
      detail: { tags: ["Users"] },
    },
  )
  .post(
    "/login",
    async ({ body, set }) => {
      const result = await loginUser(body);

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      body: loginBodySchema,
      detail: { tags: ["Users"] },
    },
  )
  .get(
    "/me",
    async ({ headers, set }) => {
      const authResult = await authService.authenticate(headers.authorization);

      const result = await getCurrentUser(
        authResult.ok ? authResult.user : null,
      );

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      headers: authHeaderSchema,
      detail: { tags: ["Users"] },
    },
  );
