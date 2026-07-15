import { desc } from "drizzle-orm";
import {
  createTagDtoSchema,
  tagDtoSchema,
  type TagDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { tags } from "@/db/schema";

export async function listTags(): Promise<TagDto[]> {
  const rows = await db.select().from(tags).orderBy(desc(tags.id));
  return rows.map((row) => tagDtoSchema.parse(row));
}

export async function createTag(body: unknown) {
  const parsedBody = createTagDtoSchema.safeParse(body);

  if (!parsedBody.success) {
    return {
      status: 400 as const,
      body: {
        message: "Payload invalido",
        issues: parsedBody.error.flatten(),
      },
    };
  }

  const now = new Date().toISOString();
  const [inserted] = await db
    .insert(tags)
    .values({
      name: parsedBody.data.name,
      color: parsedBody.data.color ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!inserted) {
    return {
      status: 500 as const,
      body: { message: "No se pudo crear el tag" },
    };
  }

  return {
    status: 201 as const,
    body: tagDtoSchema.parse(inserted),
  };
}
