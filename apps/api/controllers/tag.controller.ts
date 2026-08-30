import { desc } from "drizzle-orm";
import {
  createTagDtoSchema,
  tagDtoSchema,
  type CreateTagDto,
  type TagDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { tags } from "@/db/schema";
import type { TagRow } from "@/db/types";
import { InternalServerError, ValidationError } from "@/lib/errors";
import { invalidPayloadResponse } from "@/lib/validation";

export async function listTags(): Promise<TagDto[]> {
  const rows = await db.select().from(tags).orderBy(desc(tags.id));
  return rows.map((row) => tagDtoSchema.parse(row));
}

export async function createTag(body: CreateTagDto) {
  const parsedBody = createTagDtoSchema.safeParse(body);

  if (!parsedBody.success) {
    return new ValidationError(parsedBody.error).toResponse();
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
    return new InternalServerError("No se pudo crear el tag").toResponse();
  }

  return {
    status: 201 as const,
    body: tagDtoSchema.parse(inserted),
  };
}
