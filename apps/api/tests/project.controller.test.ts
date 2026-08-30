import { beforeEach, describe, expect, it } from "bun:test";
import { registerUser } from "@/controllers/auth.controller";
import { createProject, listProjects } from "@/controllers/project.controller";
import { resetDatabase } from "./test-db";

beforeEach(async () => {
  await resetDatabase();
});

describe("project controller", () => {
  it("crea y lista proyectos del usuario autenticado", async () => {
    const user = await registerUser({
      name: "dario",
      email: "dario@example.com",
      password: "Secret123!",
    });

    const project = await createProject(user.body.user.id, {
      name: "Proyecto Alfa",
      description: "Descripción del proyecto",
    });

    expect(project.status).toBe(201);
    expect(project.body.name).toBe("Proyecto Alfa");

    const response = await listProjects(user.body.user.id);
    expect(response.data).toHaveLength(1);
    expect(response.data[0].name).toBe("Proyecto Alfa");
    expect(response.total).toBe(1);
  });
});
