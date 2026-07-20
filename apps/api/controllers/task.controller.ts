import { desc, eq, inArray } from "drizzle-orm";
import {
  createTaskDtoSchema,
  updateTaskDtoSchema,
  taskDtoSchema,
  type TaskDto,
  type TaskStatus,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import {
  projects,
  tags,
  taskTags,
  tasks,
  users,
  projectMembers,
} from "@/db/schema";
import { and } from "drizzle-orm";
import { invalidPayloadResponse } from "@/lib/validation";

function buildTaskDto(row: {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  projectId: number | null;
  project: {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  assigneeId: number | null;
  assignee: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    id: number;
    name: string;
    color: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}): TaskDto {
  return taskDtoSchema.parse(row);
}

async function loadTaskTags(taskId: number) {
  const rows = await db
    .select({
      taskId: taskTags.taskId,
      tagId: tags.id,
      name: tags.name,
      color: tags.color,
      createdAt: tags.createdAt,
      updatedAt: tags.updatedAt,
    })
    .from(taskTags)
    .innerJoin(tags, eq(taskTags.tagId, tags.id))
    .where(eq(taskTags.taskId, taskId));

  return rows.map((row) => ({
    id: row.tagId,
    name: row.name,
    color: row.color,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}

async function loadTaskById(taskId: number) {
  const [taskRow] = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      projectId: tasks.projectId,
      projectIdValue: projects.id,
      projectName: projects.name,
      projectDescription: projects.description,
      projectCreatedAt: projects.createdAt,
      projectUpdatedAt: projects.updatedAt,
      assigneeId: tasks.assigneeId,
      assigneeIdValue: users.id,
      assigneeName: users.name,
      assigneeEmail: users.email,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.id, taskId))
    .limit(1);

  if (!taskRow) {
    return null;
  }

  const tags = await loadTaskTags(taskId);

  return buildTaskDto({
    id: taskRow.id,
    title: taskRow.title,
    description: taskRow.description,
    status: taskRow.status,
    projectId: taskRow.projectId,
    assigneeId: taskRow.assigneeId,
    assignee:
      taskRow.assigneeIdValue === null ||
      taskRow.assigneeName === null ||
      taskRow.assigneeEmail === null
        ? null
        : {
            id: taskRow.assigneeIdValue,
            name: taskRow.assigneeName,
            email: taskRow.assigneeEmail,
          },
    project:
      taskRow.projectIdValue === null ||
      taskRow.projectName === null ||
      taskRow.projectCreatedAt === null ||
      taskRow.projectUpdatedAt === null
        ? null
        : {
            id: taskRow.projectIdValue,
            name: taskRow.projectName,
            description: taskRow.projectDescription,
            createdAt: taskRow.projectCreatedAt,
            updatedAt: taskRow.projectUpdatedAt,
          },
    createdAt: taskRow.createdAt,
    updatedAt: taskRow.updatedAt,
    tags,
  });
}

async function replaceTaskTags(taskId: number, tagIds: number[]) {
  await db.delete(taskTags).where(eq(taskTags.taskId, taskId));

  if (tagIds.length > 0) {
    await db.insert(taskTags).values(
      tagIds.map((tagId) => ({
        taskId,
        tagId,
      })),
    );
  }
}

async function canUserAccessTask(userId: number, taskId: number) {
  const [row] = await db
    .select({ id: tasks.id })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
    .where(and(eq(tasks.id, taskId), eq(projectMembers.userId, userId)))
    .limit(1);

  return Boolean(row);
}

export async function listTasks(userId: number): Promise<TaskDto[]> {
  const taskRows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      projectId: tasks.projectId,
      project: {
        id: projects.id,
        name: projects.name,
        description: projects.description,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      },
      assigneeId: tasks.assigneeId,
      assignee: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.userId, userId))
    .orderBy(desc(tasks.id));

  const tagsByTaskId = await Promise.all(
    taskRows.map(async (row) => ({
      taskId: row.id,
      tags: await loadTaskTags(row.id),
    })),
  );

  const tagsByTaskIdMap = new Map(
    tagsByTaskId.map((entry) => [entry.taskId, entry.tags]),
  );

  return taskRows.map((row) =>
    buildTaskDto({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      projectId: row.projectId,
      assigneeId: row.assigneeId,
      assignee:
        row.assignee === null ||
        row.assignee.id === null ||
        row.assignee.name === null ||
        row.assignee.email === null
          ? null
          : {
              id: row.assignee.id,
              name: row.assignee.name,
              email: row.assignee.email,
            },
      project:
        row.project === null ||
        row.project.id === null ||
        row.project.name === null ||
        row.project.createdAt === null ||
        row.project.updatedAt === null
          ? null
          : {
              id: row.project.id,
              name: row.project.name,
              description: row.project.description,
              createdAt: row.project.createdAt,
              updatedAt: row.project.updatedAt,
            },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      tags: tagsByTaskIdMap.get(row.id) ?? [],
    }),
  );
}

export async function createTask(userId: number, body: unknown) {
  const parsedBody = createTaskDtoSchema.safeParse(body);

  if (!parsedBody.success) {
    return invalidPayloadResponse(parsedBody.error);
  }

  const tagIds = [...new Set(parsedBody.data.tagIds ?? [])];

  if (
    parsedBody.data.projectId !== undefined &&
    parsedBody.data.projectId !== null
  ) {
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, parsedBody.data.projectId))
      .limit(1);

    if (!project) {
      return {
        status: 400 as const,
        body: { message: "El proyecto indicado no existe" },
      };
    }

    const [membership] = await db
      .select({ userId: projectMembers.userId })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, parsedBody.data.projectId),
          eq(projectMembers.userId, userId),
        ),
      )
      .limit(1);

    if (!membership) {
      return {
        status: 403 as const,
        body: { message: "No tienes acceso a este proyecto" },
      };
    }
  }

  if (tagIds.length > 0) {
    const existingTags = await db
      .select({ id: tags.id })
      .from(tags)
      .where(inArray(tags.id, tagIds));

    if (existingTags.length !== tagIds.length) {
      return {
        status: 400 as const,
        body: { message: "Uno o mas tags indicados no existen" },
      };
    }
  }

  const now = new Date().toISOString();
  const [inserted] = await db
    .insert(tasks)
    .values({
      title: parsedBody.data.title,
      description: parsedBody.data.description ?? null,
      projectId: parsedBody.data.projectId ?? null,
      assigneeId: parsedBody.data.assigneeId ?? userId,
      status: parsedBody.data.status ?? "todo",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!inserted) {
    return {
      status: 500 as const,
      body: { message: "No se pudo crear la task" },
    };
  }

  await replaceTaskTags(inserted.id, tagIds);

  const task = await loadTaskById(inserted.id);

  if (!task) {
    return {
      status: 500 as const,
      body: { message: "No se pudo recuperar la task creada" },
    };
  }

  return {
    status: 201 as const,
    body: task,
  };
}

export async function updateTask(userId: number, taskId: number, body: unknown) {
  const parsedBody = updateTaskDtoSchema.safeParse(body);

  if (!parsedBody.success) {
    return invalidPayloadResponse(parsedBody.error);
  }

  const canAccess = await canUserAccessTask(userId, taskId);

  if (!canAccess) {
    return {
      status: 403 as const,
      body: { message: "No tienes acceso a esta task" },
    };
  }

  if (parsedBody.data.tagIds) {
    const uniqueTagIds = [...new Set(parsedBody.data.tagIds)];
    const existingTags = await db
      .select({ id: tags.id })
      .from(tags)
      .where(inArray(tags.id, uniqueTagIds));

    if (existingTags.length !== uniqueTagIds.length) {
      return {
        status: 400 as const,
        body: { message: "Uno o mas tags indicados no existen" },
      };
    }
  }

  const now = new Date().toISOString();
  const [updated] = await db
    .update(tasks)
    .set({
      title: parsedBody.data.title,
      description:
        parsedBody.data.description === undefined
          ? undefined
          : parsedBody.data.description,
      projectId:
        parsedBody.data.projectId === undefined
          ? undefined
          : parsedBody.data.projectId,
      assigneeId:
        parsedBody.data.assigneeId === undefined
          ? undefined
          : parsedBody.data.assigneeId,
      status: parsedBody.data.status,
      updatedAt: now,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updated) {
    return {
      status: 500 as const,
      body: { message: "No se pudo actualizar la task" },
    };
  }

  if (parsedBody.data.tagIds) {
    await replaceTaskTags(taskId, [...new Set(parsedBody.data.tagIds)]);
  }

  const task = await loadTaskById(taskId);

  if (!task) {
    return {
      status: 500 as const,
      body: { message: "No se pudo recuperar la task actualizada" },
    };
  }

  return {
    status: 200 as const,
    body: task,
  };
}

export async function listAssignedTasks(userId: number): Promise<TaskDto[]> {
  const taskRows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      projectId: tasks.projectId,
      projectIdValue: projects.id,
      projectName: projects.name,
      projectDescription: projects.description,
      projectCreatedAt: projects.createdAt,
      projectUpdatedAt: projects.updatedAt,
      assigneeId: tasks.assigneeId,
      assigneeIdValue: users.id,
      assigneeName: users.name,
      assigneeEmail: users.email,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.assigneeId, userId))
    .orderBy(desc(tasks.id));

  const tagsByTaskId = await Promise.all(
    taskRows.map(async (row) => ({
      taskId: row.id,
      tags: await loadTaskTags(row.id),
    })),
  );

  const tagsByTaskIdMap = new Map(
    tagsByTaskId.map((entry) => [entry.taskId, entry.tags]),
  );

  return taskRows.map((row) =>
    buildTaskDto({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      projectId: row.projectId,
      assigneeId: row.assigneeId,
      assignee:
        row.assigneeIdValue === null ||
        row.assigneeName === null ||
        row.assigneeEmail === null
          ? null
          : {
              id: row.assigneeIdValue,
              name: row.assigneeName,
              email: row.assigneeEmail,
            },
      project:
        row.projectIdValue === null ||
        row.projectName === null ||
        row.projectCreatedAt === null ||
        row.projectUpdatedAt === null
          ? null
          : {
              id: row.projectIdValue,
              name: row.projectName,
              description: row.projectDescription,
              createdAt: row.projectCreatedAt,
              updatedAt: row.projectUpdatedAt,
            },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      tags: tagsByTaskIdMap.get(row.id) ?? [],
    }),
  );
}
