import { Elysia, t } from "elysia";
import { createTag, listTags } from "@/controllers/tag.controller";

const createTagBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 80 }),
  color: t.Optional(t.String({ pattern: "^#[0-9a-fA-F]{6}$" })),
});

export const tagRoutes = new Elysia({ prefix: "/tags" })
  .get("/", async () => listTags(), { detail: { tags: ["Tags"] } })
  .post(
    "/",
    async ({ body, set }) => {
      const result = await createTag(body);

      if (result.status >= 400) {
        set.status = result.status;
      }

      return result.body;
    },
    {
      body: createTagBodySchema,
      detail: { tags: ["Tags"] },
    },
  );
