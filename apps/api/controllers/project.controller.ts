import { desc, eq } from "drizzle-orm";
import {
  createProjectDtoSchema,
  projectDtoSchema,
  type ProjectDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { projectMembers, projects } from "@/db/schema";

export async function listProjects(userId: number): Promise<ProjectDto[]> {
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
    .orderBy(desc(projects.id));
  return rows.map((row) => projectDtoSchema.parse(row));
}

export async function createProject(userId: number, body: unknown) {
  const parsedBody = createProjectDtoSchema.safeParse(body);

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
    return {
      status: 500 as const,
      body: { message: "No se pudo crear el proyecto" },
    };
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
