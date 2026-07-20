import { eq } from "drizzle-orm";
import {
  createUserSchema,
  loginSchema,
  userDtoSchema,
  type UserDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { authService } from "@/lib/auth";
import { invalidPayloadResponse } from "@/lib/validation";

export async function registerUser(body: unknown) {
  const parsedBody = createUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return invalidPayloadResponse(parsedBody.error);
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsedBody.data.email))
    .limit(1);

  if (existing) {
    return {
      status: 409 as const,
      body: { message: "El email ya está registrado" },
    };
  }

  const passwordHash = await Bun.password.hash(parsedBody.data.password);
  const now = new Date().toISOString();
  const [inserted] = await db
    .insert(users)
    .values({
      name: parsedBody.data.name,
      email: parsedBody.data.email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  if (!inserted) {
    return {
      status: 500 as const,
      body: { message: "No se pudo crear el usuario" },
    };
  }

  return {
    status: 201 as const,
    body: await authService.createAuthResponse(userDtoSchema.parse(inserted)),
  };
}

export async function loginUser(body: unknown) {
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return invalidPayloadResponse(parsedBody.error);
  }

  const [userRecord] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.name, parsedBody.data.name))
    .limit(1);

  if (!userRecord) {
    return {
      status: 401 as const,
      body: { message: "Credenciales invalidas" },
    };
  }

  const validPassword = await Bun.password.verify(
    parsedBody.data.password,
    userRecord.passwordHash,
  );

  if (!validPassword) {
    return {
      status: 401 as const,
      body: { message: "Credenciales invalidas" },
    };
  }

  return {
    status: 200 as const,
    body: await authService.createAuthResponse(
      userDtoSchema.parse({
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
      }),
    ),
  };
}

export async function getCurrentUser(currentUser: UserDto | null) {
  const authResult = authService.requireUser(currentUser);

  if (!authResult.ok) {
    return authResult;
  }

  return {
    status: 200 as const,
    body: authResult.user,
  };
}
