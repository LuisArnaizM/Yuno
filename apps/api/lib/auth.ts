import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { userDtoSchema, type UserDto } from "@yuno/shared-types";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { jwtSecret, verifyJwt } from "@/lib/jwt";

type AuthPayload = {
  sub: number;
};

export const authPlugin = new Elysia({ name: "auth-plugin" }).derive(
  async ({ headers }) => {
    return { currentUser: await resolveCurrentUser(headers.authorization) };
  },
);

export async function resolveCurrentUser(
  authorization?: string,
): Promise<UserDto | null> {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  const payload = await verifyJwt<AuthPayload>(token, jwtSecret);

  if (!payload?.sub) {
    return null;
  }

  const [userRow] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1);

  return userRow ? userDtoSchema.parse(userRow) : null;
}

export { jwtSecret };
