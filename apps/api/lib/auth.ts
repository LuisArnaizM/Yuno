import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { userDtoSchema, type UserDto } from "@yuno/shared-types";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { jwtSecret, signJwt, verifyJwt } from "@/lib/jwt";

type AuthPayload = {
  sub: number;
};

export type AuthResponse = {
  user: UserDto;
  token: string;
};

type RequireUserResult =
  | {
      ok: true;
      user: UserDto;
    }
  | {
      ok: false;
      status: 401;
      body: {
        message: "No autorizado";
      };
    };

class AuthService {
  constructor(private readonly secret: string) {}

  async createAuthResponse(user: UserDto): Promise<AuthResponse> {
    return {
      user,
      token: await signJwt({ sub: user.id }, this.secret),
    };
  }

  async resolveCurrentUser(authorization?: string): Promise<UserDto | null> {
    if (!authorization?.startsWith("Bearer ")) {
      return null;
    }

    const token = authorization.slice("Bearer ".length).trim();
    const payload = await verifyJwt<AuthPayload>(token, this.secret);

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

  async authenticate(authorization?: string): Promise<RequireUserResult> {
    return this.requireUser(await this.resolveCurrentUser(authorization));
  }

  requireUser(currentUser: UserDto | null): RequireUserResult {
    if (!currentUser) {
      return {
        ok: false,
        status: 401,
        body: { message: "No autorizado" },
      };
    }

    return {
      ok: true,
      user: currentUser,
    };
  }
}

export const authService = new AuthService(jwtSecret);

export const authPlugin = new Elysia({ name: "auth-plugin" }).derive(
  async ({ headers }) => {
    return {
      currentUser: await authService.resolveCurrentUser(headers.authorization),
    };
  },
);

export async function resolveCurrentUser(
  authorization?: string,
): Promise<UserDto | null> {
  return authService.resolveCurrentUser(authorization);
}

export { jwtSecret };
