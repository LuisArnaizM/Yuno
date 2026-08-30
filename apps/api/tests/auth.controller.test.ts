import { beforeEach, describe, expect, it } from "bun:test";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "@/controllers/auth.controller";
import { resetDatabase } from "./test-db";

beforeEach(async () => {
  await resetDatabase();
});

describe("auth controller", () => {
  it("registra un usuario y permite iniciar sesión", async () => {
    const registerResponse = await registerUser({
      name: "ana",
      email: "ana@example.com",
      password: "Secret123!",
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe("ana@example.com");
    expect(registerResponse.body.token).toBeString();

    const loginResponse = await loginUser({
      name: "ana",
      password: "Secret123!",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.email).toBe("ana@example.com");
    expect(loginResponse.body.token).toBeString();
  });

  it("rechaza credenciales inválidas y usuarios sin autenticación", async () => {
    await registerUser({
      name: "benito",
      email: "benito@example.com",
      password: "Secret123!",
    });

    const badLogin = await loginUser({
      name: "benito",
      password: "wrong-password",
    });

    expect(badLogin.status).toBe(401);
    expect(badLogin.body.message).toBe("Credenciales invalidas");

    const authResult = await getCurrentUser(null);
    expect(authResult.status).toBe(401);
    expect(authResult.body.message).toBe("No autorizado");
  });

  it("rechaza emails duplicados al registrarse", async () => {
    await registerUser({
      name: "carla",
      email: "carla@example.com",
      password: "Secret123!",
    });

    const duplicate = await registerUser({
      name: "carla2",
      email: "carla@example.com",
      password: "Other123!",
    });

    expect(duplicate.status).toBe(409);
    expect(duplicate.body.message).toBe("El email ya está registrado");
  });
});
