import { eq } from "drizzle-orm";
import {
  createUserSchema,
  loginSchema,
  userDtoSchema,
  type CreateUserDto,
  type LoginDto,
  type UserDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { UserRow } from "@/db/types";
import { authService } from "@/lib/auth";
import {
  ConflictError,
  InternalServerError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import { invalidPayloadResponse } from "@/lib/validation";

export async function registerUser(body: CreateUserDto) {
  const parsedBody = createUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return new ValidationError(parsedBody.error).toResponse();
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsedBody.data.email))
    .limit(1);

  if (existing) {
    return new ConflictError("El email ya está registrado").toResponse();
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
    .returning();

  if (!inserted) {
    return new InternalServerError("No se pudo crear el usuario").toResponse();
  }

  return {
    status: 201 as const,
    body: await authService.createAuthResponse(userDtoSchema.parse(inserted)),
  };
}

export async function loginUser(body: LoginDto) {
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return new ValidationError(parsedBody.error).toResponse();
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
    return new UnauthorizedError("Credenciales invalidas").toResponse();
  }

  const validPassword = await Bun.password.verify(
    parsedBody.data.password,
    userRecord.passwordHash,
  );

  if (!validPassword) {
    return new UnauthorizedError("Credenciales invalidas").toResponse();
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
    return new UnauthorizedError(authResult.body.message).toResponse();
  }

  return {
    status: 200 as const,
    body: authResult.user,
  };
}
