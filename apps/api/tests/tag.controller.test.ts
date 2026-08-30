import { beforeEach, describe, expect, it } from "bun:test";
import { createTag, listTags } from "@/controllers/tag.controller";
import { resetDatabase } from "./test-db";

beforeEach(async () => {
  await resetDatabase();
});

describe("tag controller", () => {
  it("crea y lista etiquetas disponibles", async () => {
    const tag = await createTag({ name: "Urgente", color: "#ff0000" });

    expect(tag.status).toBe(201);
    expect(tag.body.name).toBe("Urgente");

    const tagsResponse = await listTags();
    expect(tagsResponse).toHaveLength(1);
    expect(tagsResponse[0].name).toBe("Urgente");
  });
});
