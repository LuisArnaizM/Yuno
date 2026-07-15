import { eq } from "drizzle-orm";
import {
  createUserSchema,
  loginSchema,
  userDtoSchema,
  type UserDto,
} from "@yuno/shared-types";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { jwtSecret, signJwt } from "@/lib/jwt";

type AuthResponse = {
  user: UserDto;
  token: string;
};

async function buildAuthResponse(user: UserDto): Promise<AuthResponse> {
  return {
    user,
    token: await signJwt({ sub: user.id }, jwtSecret),
  };
}

export async function registerUser(body: unknown) {
  const parsedBody = createUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return {
      status: 400 as const,
      body: {
        message: "Payload invalido",
        issues: parsedBody.error.flatten(),
      },
    };
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
    body: await buildAuthResponse(userDtoSchema.parse(inserted)),
  };
}

export async function loginUser(body: unknown) {
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return {
      status: 400 as const,
      body: {
        message: "Payload invalido",
        issues: parsedBody.error.flatten(),
      },
    };
  }

  const [userRecord] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, parsedBody.data.email))
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
    body: await buildAuthResponse(
      userDtoSchema.parse({
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
      }),
    ),
  };
}

export async function getCurrentUser(currentUser: UserDto | null) {
  if (!currentUser) {
    return {
      status: 401 as const,
      body: { message: "No autorizado" },
    };
  }

  return {
    status: 200 as const,
    body: currentUser,
  };
}
