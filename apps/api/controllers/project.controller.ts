import { desc, eq, sql } from "drizzle-orm";
import {
  createProjectDtoSchema,
  projectDtoSchema,
  type CreateProjectDto,
  type ProjectDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { projectMembers, projects } from "@/db/schema";
import type { ProjectRow } from "@/db/types";
import {
  BadRequestError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors";
import { buildPaginatedResponse, normalizePagination } from "@/lib/pagination";
import { invalidPayloadResponse } from "@/lib/validation";

export async function listProjects(
  userId: number,
  pagination?: { page?: number; pageSize?: number },
) {
  const { page, pageSize, offset } = normalizePagination(pagination);

  const totalRows = await db
    .select({ count: sql<number>`count(*)`.as("count") })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.userId, userId));

  const total = Number(totalRows[0]?.count ?? 0);

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.userId, userId))
    .orderBy(desc(projects.id))
    .limit(pageSize)
    .offset(offset);

  return buildPaginatedResponse(
    rows.map((row) => projectDtoSchema.parse(row)),
    total,
    page,
    pageSize,
  );
}

export async function createProject(userId: number, body: CreateProjectDto) {
  const parsedBody = createProjectDtoSchema.safeParse(body);

  if (!parsedBody.success) {
    return new ValidationError(parsedBody.error).toResponse();
  }

  const now = new Date().toISOString();
  const [inserted] = await db
    .insert(projects)
    .values({
      name: parsedBody.data.name,
      description: parsedBody.data.description ?? null,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!inserted) {
    return new InternalServerError("No se pudo crear el proyecto").toResponse();
  }

  await db.insert(projectMembers).values({
    projectId: inserted.id,
    userId,
  });

  return {
    status: 201 as const,
    body: projectDtoSchema.parse(inserted),
  };
}
