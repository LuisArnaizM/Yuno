import { Elysia, t } from "elysia";
import { getDashboardSummary } from "@/controllers/dashboard.controller";
import { authService } from "@/lib/auth";

const authHeaderSchema = t.Object({
  authorization: t.Optional(t.String()),
});

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" }).get(
  "/summary",
  async ({ headers, set }) => {
    const authResult = await authService.authenticate(headers.authorization);

    if (!authResult.ok) {
      set.status = authResult.status;
      return authResult.body;
    }

    return getDashboardSummary(authResult.user.id);
  },
  {
    headers: authHeaderSchema,
    detail: { tags: ["Dashboard"] },
  },
);
