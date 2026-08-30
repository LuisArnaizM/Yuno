import { beforeEach, describe, expect, it } from "bun:test";
import { registerUser } from "@/controllers/auth.controller";
import { createProject } from "@/controllers/project.controller";
import { createTag } from "@/controllers/tag.controller";
import {
  createTask,
  listAssignedTasks,
  listTasks,
  updateTask,
} from "@/controllers/task.controller";
import { resetDatabase } from "./test-db";

beforeEach(async () => {
  await resetDatabase();
});

describe("task controller", () => {
  it("crea, actualiza, lista y restringe tareas por acceso", async () => {
    const owner = await registerUser({
      name: "owner",
      email: "owner@example.com",
      password: "Secret123!",
    });
    const otherUser = await registerUser({
      name: "other",
      email: "other@example.com",
      password: "Secret123!",
    });

    const project = await createProject(owner.body.user.id, {
      name: "Proyecto de tareas",
      description: "Proyecto para validar tareas",
    });

    const tag = await createTag({ name: "Backend", color: "#00ff00" });

    const createdTask = await createTask(owner.body.user.id, {
      title: "Implementar auth",
      description: "Endpoint para login",
      projectId: project.body.id,
      assigneeId: owner.body.user.id,
      status: "todo",
      tagIds: [tag.body.id],
    });

    expect(createdTask.status).toBe(201);
    expect(createdTask.body.title).toBe("Implementar auth");
    expect(createdTask.body.tags).toHaveLength(1);

    const updatedTask = await updateTask(
      owner.body.user.id,
      createdTask.body.id,
      {
        title: "Implementar auth v2",
        status: "in_progress",
        tagIds: [tag.body.id],
      },
    );

    expect(updatedTask.status).toBe(200);
    expect(updatedTask.body.title).toBe("Implementar auth v2");
    expect(updatedTask.body.status).toBe("in_progress");

    const memberTasks = await listTasks(owner.body.user.id);
    expect(memberTasks.data).toHaveLength(1);
    expect(memberTasks.data[0].title).toBe("Implementar auth v2");

    const assignedTasks = await listAssignedTasks(owner.body.user.id);
    expect(assignedTasks.data).toHaveLength(1);
    expect(assignedTasks.data[0].assignee?.id).toBe(owner.body.user.id);

    const forbiddenUpdate = await updateTask(
      otherUser.body.user.id,
      createdTask.body.id,
      {
        title: "Intento de cambio",
        status: "done",
      },
    );

    expect(forbiddenUpdate.status).toBe(403);
    expect(forbiddenUpdate.body.message).toBe("No tienes acceso a esta task");
  });
});
